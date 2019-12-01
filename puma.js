const http = require('http')
const process = require('process')

const config = require('./config/config').Config()
const logger = require('./util/log/logUtil').getLogger(config)
const handlerUtil = require('./util/http/handlerUtil')
const httpUtil = require('./util/http/httpUtil')
// const dbPool = require('./util/db/dbUtil').getDbPool(config) //uncomment this line once MySQL is up
const dbPool = undefined // comment/remove this line once MySQL is up

const startUpInitPromise = (config) => {
  return new Promise((resolve, reject) => {
    handlerUtil.startUpInit(config)
    resolve('done')
  })
}

const registerHandlersPromise = (config) => {
  return new Promise((resolve, reject) => {
    handlerUtil.registerHandlers(config)
    resolve('done')
  })
}

const start = async () => {
  await Promise.all([startUpInitPromise({ config: config, logger: logger, dbPool: dbPool }), registerHandlersPromise({ config: config, logger: logger, dbPool: dbPool })])
}

start()

const server = http.createServer((req, res) => {
  httpUtil.process({
    config: config,
    logger: logger,
    req: req,
    res: res
  })
})

logger.info('server starting up ...')

server.listen(config.Site.Port)

const req = http.get('http://' + config.Site.Url + ':' + config.Site.Port, (res) => {
  logger.info('server started up ...')
}).on('error', (e) => {
  logger.error(`error contact server: ${e.message}`)
})
req.setTimeout(config.Site.CheckAliveTimeoutSec * 1000)

process.on('SIGINT', () => {
  logger.info('received an interrupt signal, server shutting down ...')
  handlerUtil.shutdownCleanUp({ config: config, logger: logger, dbPool: dbPool })
  process.exit()
})
