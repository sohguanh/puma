const i18n = require('i18n')

global.i18n = undefined

module.exports.getI18n = (inputParam) => {
  if (global.i18n === undefined) {
    const config = inputParam.config
    const logger = inputParam.logger
    i18n.configure({
      directory: config.i18nConfig.Path,
      logDebugFn: (msg) => {
        logger.debug(msg)
      },
      logWarnFn: (msg) => {
        logger.warn(msg)
      },
      logErrorFn: (msg) => {
        logger.error(msg)
      }
    })
    global.i18n = i18n
  }
  return global.i18n
}
