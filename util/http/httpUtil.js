const http = require('http')
const process = require('process')
const path = require('path')
const fs = require('fs')

const httpRewriteUtil = require('./httpRewriteUtil')
const httpStaticFileUtil = require('./httpStaticFileUtil')

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
global.placeHolderRe = /(?:{\s*(\w+)\s*}|:\s*(\w+))/i

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

global.registeredHandlersPathParamMap = new Map()

function registerHandlerPathParam (url, clsObj, httpMethods) {
  registerChainHandlerPathParam(url, [clsObj], httpMethods)
}

function registerChainHandlerPathParam (url, clsObjArray, httpMethods) {
  global.registeredHandlersPathParamMap.set(url, { handler_class: clsObjArray, httpMethods: httpMethods, pathToken: url.split('/') })
}

function processReq (inputParam) {
  const logger = inputParam.logger
  const config = inputParam.config
  const req = inputParam.req
  const res = inputParam.res

  logger.info(req.url)
  let urlpath = req.url.split('?')[0]

  if (urlpath === '/') {
    res.writeHead(200, { Server: config.Site.Name, 'Content-Type': 'text/plain' })
    res.write('I am alive!')
    res.end()
    return
  }

  if (config.Site.UrlRewrite) {
    urlpath = httpRewriteUtil.getRewriteUrl(inputParam, req.url)
  }

  if (httpStaticFileUtil.existStaticFilePath(inputParam) && req.url.startsWith(config.Site.StaticFilePath)) {
    serveStaticFile(inputParam, req.url, req, res)
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

  // iterate registered_and/or chain path param handlers to see if key match req.url
  for (const key of global.registeredHandlersPathParamMap.keys()) {
    const handler = global.registeredHandlersPathParamMap.get(key)
    const actualToken = urlpath.split('/')
    if (handler.pathToken.length === actualToken.length) {
      const paramMap = {}
      let found = true
      for (let index = 0; index < handler.pathToken.length; index++) {
        const match = global.placeHolderRe.exec(handler.pathToken[index])
        if (match !== null) {
          paramMap[match[0]] = actualToken[index]
        } else if (handler.pathToken[index] !== actualToken[index]) {
          found = false
          break
        }
      }

      if (found) {
        logger.info('registered path param handler found ' + key)
        if (handler.httpMethods.includes(req.method)) {
          for (let index = 0; index < handler.handler_class.length; index++) {
            const ret = handler.handler_class[index].handle(req, res, paramMap)
            if (ret === undefined || ret === false) break
          }
        }
        return
      }
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

async function serveStaticFile (inputParam, url, req, res) {
  const logger = inputParam.logger
  const filename = process.cwd() + path.sep + url.split('?')[0]
  try {
    const exist = await httpStaticFileUtil.existFile(filename, inputParam)
    if (exist) {
      const mimeType = await httpStaticFileUtil.getMimeType(filename)
      fs.readFile(filename, 'binary', (err, file) => {
        if (err) return defaultNotFound(req, res, inputParam.config)
        res.writeHead(200, { 'Content-Type': mimeType })
        res.write(file, 'binary')
        res.end()
      })
    } else {
      defaultNotFound(req, res, inputParam.config)
    }
  } catch (err) {
    logger.error(err)
    defaultNotFound(req, res, inputParam.config)
  }
}

module.exports = {
  placeHolderRe: global.placeHolderRe,
  HTTP_METHOD: global.HTTP_METHOD,
  Handler,
  PathParamHandler,
  defaultNotFound,
  getUrlParamMap,
  processReq,
  registerHandler,
  registerChainHandler,
  registerHandlerRegex,
  registerChainHandlerRegex,
  registerHandlerPathParam,
  registerChainHandlerPathParam
}
