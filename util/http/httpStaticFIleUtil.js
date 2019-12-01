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
      global.staticFileUtil = false
      logger.error(err)
    }
  }
  return global.staticFileUtil
}

function existFile (file, inputParam) {
  const logger = inputParam.logger

  let exist = false
  try {
    exist = !!((fs.lstatSync(file).isFile() && fs.existsSync(file)))
  } catch (err) {
    exist = false
    logger.error(err)
  }
  return exist
}

function getMimeType (file) {
  let mimeType = mime.lookup(file)
  if (!mimeType) {
    mimeType = 'application/octet-stream'
  }
  return mimeType
}

module.exports = {
  existStaticFilePath,
  existFile,
  getMimeType
}
