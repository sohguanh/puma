function startUpInit (inputParam) {
  // ENTRY POINT: perform any pre-loading/caching of objects or anything else before server startup in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  const dbPool = inputParam.dbPool
  logger.info('startup init ...')
}

function shutdownCleanUp (inputParam) {
  // ENTRY POINT: perform any cleaning up of objects or anything else before server shutdown in here (if any)
  const logger = inputParam.logger
  const config = inputParam.config
  const dbPool = inputParam.dbPool
  logger.info('shutdown cleanup ...')
}

function registerHandlers (inputParam) {
  // ENTRY POINT: register all handlers in here
  const logger = inputParam.logger
  const config = inputParam.config
  const dbPool = inputParam.dbPool
  logger.info('register all handlers ...')
}

module.exports = {
  startUpInit,
  shutdownCleanUp,
  registerHandlers
}
