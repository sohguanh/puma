const fs = require('fs')
const mime = require('mime-types')

global.staticFileUtil = undefined

function existStaticFilePath (inputParam) {
  if (global.staticFileUtil === undefined) {
    const config = inputParam.config
    const logger = inputParam.logger

    try {
      global.staticFileUtil = !!((fs.lstatSync(config.Site.StaticFilePath).isDirectory() && fs.existsSync(config.Site.StaticFilePath)))
      if (config.Site.StaticFilePath[0] !== '/') {
        config.Site.StaticFilePath = '/' + config.Site.StaticFilePath
      }
    } catch (err) {
      logger.error(err)
      global.staticFileUtil = false
    }
  }
  return global.staticFileUtil
}

function existFile (file, inputParam) {
  return new Promise((resolve, reject) => {
    const logger = inputParam.logger
    let exist = false
    try {
      exist = !!((fs.lstatSync(file).isFile() && fs.existsSync(file)))
      resolve(exist)
    } catch (err) {
      logger.error(err)
      reject(err)
    }
  })
}

function getMimeType (file) {
  return new Promise((resolve) => {
    let mimeType = mime.lookup(file)
    if (!mimeType) {
      mimeType = 'application/octet-stream'
    }
    resolve(mimeType)
  })
}

module.exports = {
  existStaticFilePath,
  existFile,
  getMimeType
}
