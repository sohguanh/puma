global.logger = undefined;

module.exports.getLogger = (config) => {
    if (logger === undefined) {
        const { createLogger, format, transports } = require('winston');
        const { combine, timestamp, label, printf } = format;        
        
        logger = createLogger({
          level: "info",
          format: combine(
            label({ label: '' }),
            timestamp(),
            printf(({ level, message, label, timestamp }) => {
                return `${timestamp} [${label}] ${level}: ${message}`;
            })
          )
        });    
        
        logger.level = config.Site.LogLevel;

        if (config.Site.LogToFile) {
            logger.add(new transports.File({ filename: config.Site.Name+".log" }));
        } else {
            logger.add(new transports.Console());
        }            
    }
    return logger;
};
