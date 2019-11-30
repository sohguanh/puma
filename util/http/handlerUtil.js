const httpUtil = require('./httpUtil')

function startUpInit (inputParam) {
  // ENTRY POINT: perform any pre-loading/caching of objects or anything else before server startup in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  logger.info('startup init ...')
}

function shutdownCleanUp (inputParam) {
  // ENTRY POINT: perform any cleaning up of objects or anything else before server shutdown in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  logger.info('shutdown cleanup ...')
}

class MyHandler extends httpUtil.Handler {
  constructor (name, inputParam) {
    super()
    this.name = name
    this.config = inputParam.config
  }

  handle (req, res) { // make sure this method return boolean if use as ChainHandler
    res.writeHead(200, { Server: this.config.Site.Name, 'Content-Type': 'text/plain' })
    res.write(this.name)
    const urlParamMap = httpUtil.getUrlParamMap(req)
    if (urlParamMap !== undefined) {
      res.write('\n' + JSON.stringify(urlParamMap, null, 2))
    }
    res.end()
  }
}

class MyChainHandler extends httpUtil.Handler {
  constructor (name, execNextHandlerFlag, inputParam) {
    super()
    this.name = name
    this.execNextHandlerFlag = execNextHandlerFlag
    this.config = inputParam.config
  }

  handle (req, res) { // make sure this method return boolean if use as ChainHandler
    res.write(this.name + '\n')
    if (!this.execNextHandlerFlag) {
      res.end()
    }
    return this.execNextHandlerFlag
  }
}

function registerHandlers (inputParam) {
  // ENTRY POINT: register all handlers in here
  const logger = inputParam.logger
  const config = inputParam.config
  logger.info('register all handlers ...')

  // take note below are just examples on how to register handlers to the url
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.Handler
  const param = {
    config: config,
    logger: logger
  }
  httpUtil.registerHandler('/hello1', new MyHandler('My Handler!', param), [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])

  // take note below are just examples on how to register chain handlers to the url
  // usually for chain of handlers, the last handler is the one that write out to client
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.Handler
  httpUtil.registerChainHandler('/hello2', [new MyChainHandler('My Chain Handler 1', true, param), new MyChainHandler('My Chain Handler 2', false, param)], [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])

  // take note below are just examples on how to register regex handlers to the url
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.Handler
  httpUtil.registerHandlerRegex('^/hello3/.*/123+', new MyHandler('My Regex Handler!', param), [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])

  // take note below are just examples on how to register chain regex handlers to the url
  // usually for chain of handlers, the last handler is the one that write out to client
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.Handler
  httpUtil.registerChainHandlerRegex('^/hello4/.*/456$', [new MyChainHandler('My Regex Chain Handler 1', true, param), new MyChainHandler('My Regex Chain Handler 2', false, param)], [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])
}

module.exports = {
  startUpInit,
  shutdownCleanUp,
  registerHandlers
}
