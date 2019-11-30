global.logger = undefined

module.exports.getLogger = (config) => {
  if (global.logger === undefined) {
    const { createLogger, format, transports } = require('winston')
    const { combine, timestamp, label, printf } = format

    global.logger = createLogger({
      level: 'info',
      format: combine(
        label({ label: '' }),
        timestamp(),
        printf(({ level, message, label, timestamp }) => {
          return `${timestamp} [${label}] ${level}: ${message}`
        })
      )
    })

    global.logger.level = config.Site.LogLevel

    if (config.Site.LogToFile) {
      global.logger.add(new transports.File({ filename: config.Site.Name + '.log' }))
    } else {
      global.logger.add(new transports.Console())
    }
  }
  return global.logger
}
