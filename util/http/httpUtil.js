const http = require('http')

class Handler {
  constructor () {
  }

  handle (req, res) { // make sure this method return boolean if use as ChainHandler
  }
}

class PathParamHandler {
  constructor () {
  }

  handle (req, res, paramMap) { // make sure this method return boolean if use as ChainPathParamHandler
  }
}

global.HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  HEAD: 'HEAD',
  PUT: 'PUT',
  DELETE: 'DELETE',
  CONNECT: 'CONNECT',
  OPTIONS: 'OPTIONS',
  TRACE: 'TRACE',
  PATCH: 'PATCH'
}

global.registeredHandlersMap = new Map()

function registerHandler (url, clsObj, httpMethods) {
  registerChainHandler(url, [clsObj], httpMethods)
}

function registerChainHandler (url, clsObjArray, httpMethods) {
  global.registeredHandlersMap.set(url, { handler_class: clsObjArray, httpMethods: httpMethods })
}

global.registeredHandlersREMap = new Map()

function registerHandlerRegex (url, clsObj, httpMethods) {
  registerChainHandlerRegex(url, [clsObj], httpMethods)
}

function registerChainHandlerRegex (url, clsObjArray, httpMethods) {
  global.registeredHandlersREMap.set(url, { handler_class: clsObjArray, httpMethods: httpMethods, re: new RegExp(url, 'i') })
}

function process (inputParam) {
  const logger = inputParam.logger
  const config = inputParam.config
  const req = inputParam.req
  const res = inputParam.res

  logger.info(req.url)
  const urlpath = req.url.split('?')[0]

  if (urlpath === '/') {
    res.writeHead(200, { Server: config.Site.Name, 'Content-Type': 'text/plain' })
    res.write('I am alive!')
    res.end()
    return
  }

  // iterate registered_and/or chain handlers to see if key match req.url
  if (global.registeredHandlersMap.has(urlpath)) {
    logger.info('registered handler found ' + urlpath)
    const handler = global.registeredHandlersMap.get(urlpath)
    if (handler.httpMethods.includes(req.method)) {
      for (let index = 0; index < handler.handler_class.length; index++) {
        const ret = handler.handler_class[index].handle(req, res)
        if (ret === undefined || ret === false) break
      }
    } else {
      defaultNotFound(req, res, config)
    }
    return
  }

  // iterate registered_and/or chain regex handlers to see if key regex match req.url
  for (const key of global.registeredHandlersREMap.keys()) {
    const handler = global.registeredHandlersREMap.get(key)
    if (handler.re.test(urlpath)) {
      logger.info('registered regex handler found ' + key)
      if (handler.httpMethods.includes(req.method)) {
        for (let index = 0; index < handler.handler_class.length; index++) {
          const ret = handler.handler_class[index].handle(req, res)
          if (ret === undefined || ret === false) break
        }
      } else {
        defaultNotFound(req, res, config)
      }
      return
    }
  }

  defaultNotFound(req, res, config)
}

function defaultNotFound (req, res, config) {
  res.writeHead(404, { Server: config !== undefined ? config.Site.Name : '', 'Content-Type': 'text/plain' })
  res.write(http.STATUS_CODES['404'])
  res.end()
}

function getUrlParamMap (req) {
  const param = req.url.split('?')
  if (param !== undefined && param.length > 1) {
    const retMap = {}
    param[1].split('&').forEach((paramValue, index) => {
      const keyValue = paramValue.split('=')
      retMap[keyValue[0]] = keyValue[1]
    })
    return retMap
  } else {
    return undefined
  }
}

module.exports = {
  HTTP_METHOD: global.HTTP_METHOD,
  Handler,
  PathParamHandler,
  defaultNotFound,
  getUrlParamMap,
  process,
  registerHandler,
  registerChainHandler,
  registerHandlerRegex,
  registerChainHandlerRegex
}
