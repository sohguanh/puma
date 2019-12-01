global.dbPool = undefined

module.exports.getDbPool = (config) => {
  if (global.dbPool === undefined) {
    global.dbPool = require('mysql').createPool({
      connectionLimit: config.Database.PoolSize,
      host: config.Database.Host,
      port: config.Database.Port,
      user: config.Database.Username,
      password: config.Database.Password,
      database: config.Database.Name
    })
  }
  return global.dbPool
}
