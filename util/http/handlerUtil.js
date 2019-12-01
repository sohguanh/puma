const httpUtil = require('./httpUtil')
const httpRewriteUtil = require('./httpRewriteUtil')

function startUpInit (inputParam) {
  // ENTRY POINT: perform any pre-loading/caching of objects or anything else before server startup in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  const dbPool = inputParam.dbPool
  logger.info('startup init ...')

  // take note below is an example on how to use dbPool
  if (dbPool !== undefined) {
    dbPool.getConnection((err, connection) => {
      if (err) {
        logger.error(err) // not connected!
        return
      }
      connection.query('SELECT CONVERT(CURRENT_DATE(), CHAR) AS CURR_DATE', (error, results, fields) => {
        logger.info(results[0].CURR_DATE)
        connection.release()
        if (error) logger.error(error)
      })
    })
  }
}

function shutdownCleanUp (inputParam) {
  // ENTRY POINT: perform any cleaning up of objects or anything else before server shutdown in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  const dbPool = inputParam.dbPool
  logger.info('shutdown cleanup ...')

  // take note below is an example on how to use dbPool
  if (dbPool !== undefined) {
    dbPool.end((err) => {
      if (err) logger.error(err)
    })
  }
}

class MyHandler extends httpUtil.Handler {
  constructor (name, inputParam) {
    super()
    this.name = name
    this.config = inputParam.config
    this.inputParam = inputParam
  }

  handle (req, res) { // make sure this method return boolean if use as ChainHandler
    res.writeHead(200, { Server: this.config.Site.Name, 'Content-Type': 'text/plain; charset=utf-8' })
    res.write(this.name)
    res.write('\n' + 'Hello world')
    const i18nUtil = require('../i18n/i18nUtil').getI18n(this.inputParam)
    const sprintf = require('sprintf-js').sprintf

    i18nUtil.setLocale('messages_en_US')
    const howAreYouUS = i18nUtil.__('how.are.you')
    const specialDateUS = sprintf(i18nUtil.__('special.date'), 3, 12, 1974)

    i18nUtil.setLocale('messages_zh_CN')
    const howAreYouCN = i18nUtil.__('how.are.you')
    const specialDateCN = sprintf(i18nUtil.__('special.date'), 1974, 12, 3)

    i18nUtil.setLocale('messages_zh_TW')
    const howAreYouTW = i18nUtil.__('how.are.you')
    const specialDateTW = sprintf(i18nUtil.__('special.date'), 1974, 12, 3)

    res.write('\nEnglish : ' + howAreYouUS)
    res.write('\nSimplified Chinese : ' + howAreYouCN)
    res.write('\nTraditional Chinese : ' + howAreYouTW)
    res.write('\n\nEnglish : ' + specialDateUS)
    res.write('\nSimplified Chinese : ' + specialDateCN)
    res.write('\nTraditional Chinese : ' + specialDateTW)

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

class MyPathParamHandler extends httpUtil.PathParamHandler {
  constructor (name, inputParam) {
    super()
    this.name = name
    this.config = inputParam.config
  }

  handle (req, res, paramMap) { // make sure this method return boolean if use as ChainHandler
    res.writeHead(200, { Server: this.config.Site.Name, 'Content-Type': 'text/plain' })
    res.write(this.name + '\n')
    res.write(JSON.stringify(paramMap, null, 2) + '\n')
    res.end()
  }
}

class MyChainPathParamHandler extends httpUtil.PathParamHandler {
  constructor (name, execNextHandlerFlag, inputParam) {
    super()
    this.name = name
    this.execNextHandlerFlag = execNextHandlerFlag
    this.config = inputParam.config
  }

  handle (req, res, paramMap) { // make sure this method return boolean if use as ChainHandler
    res.write(this.name + '\n')
    res.write(JSON.stringify(paramMap, null, 2) + '\n')
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
  const dbPool = inputParam.dbPool
  logger.info('register all handlers ...')

  // take note below are just examples on how to register handlers to the url
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.Handler
  const param = {
    config: config,
    logger: logger,
    dbPool: dbPool
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

  // take note below are just examples on how to register path param handlers to the url. accepted placeholder are {} and :
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.PathParamHandler
  httpUtil.registerHandlerPathParam('/hello5/{hi}/:bye', new MyPathParamHandler('My Path Param Handler!', param), [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])

  // take note below are just examples on how to register path param chain handlers to the url. accepted placeholder are {} and :
  // usually for chain of handlers, the last handler is the one that write out to client
  // for your own usage please CHANGE THEM to your own handler
  // must implement "interface" in httpUtil.PathParamHandler
  httpUtil.registerChainHandlerPathParam('/hello6/{hi}/:bye', [new MyChainPathParamHandler('My Path Param Chain Handler 1', true, param), new MyChainPathParamHandler('My Path Param Chain Handler 2', false, param)], [httpUtil.HTTP_METHOD.GET, httpUtil.HTTP_METHOD.POST])

  // take note below are just examples on how to add rewrite url. source_url parameter accepted placeholder are {} and : and target_url parameter substituition syntax is $1 $ 2 etc
  httpRewriteUtil.addRewriteUrl('/test/me/1', '/hello1')
  httpRewriteUtil.addRewriteUrl('/test/me/2', '/hello2')
  httpRewriteUtil.addRewriteUrlRegex('^/test/me/[3]$', '/hello3/aaa/123')
  httpRewriteUtil.addRewriteUrlRegex('^/test/me/[4]$', '/hello4/bbb/456')
  httpRewriteUtil.addRewriteUrlPathParam('/test/me/5/{hi}/:bye', '/hello5/$1/$2')
  httpRewriteUtil.addRewriteUrlPathParam('/test/me/6/{hi}/:bye', '/hello6/$1/$2')
}

module.exports = {
  startUpInit,
  shutdownCleanUp,
  registerHandlers
}
