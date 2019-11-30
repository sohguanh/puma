global.config = undefined

exports.Config = () => {
  if (global.config === undefined) {
    const fs = require('fs')
    const process = require('process')
    const path = require('path')

    const data = JSON.parse(fs.readFileSync(process.cwd() + path.sep + 'config' + path.sep + 'config.json'))
    const env = data.Env
    global.config = data[env]
  }
  return global.config
}
