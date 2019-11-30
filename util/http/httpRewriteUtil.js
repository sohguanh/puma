// key is source_url, value is target_url
global.rewriteUrl = new Map()

function addRewriteUrl (sourceUrl, targetUrl) {
  global.rewriteUrl.set(sourceUrl, targetUrl)
}

function addRewriteUrlPathParam (sourceUrl, targetUrl) {
  // sourceUrl parameter placeholder syntax is {} or : and targetUrl parameter substituition syntax is $1 $ 2 etc.
  global.rewriteUrl.set(sourceUrl, targetUrl)
}

// key is sourceUrl re, value is targetUrl
global.rewriteUrlRegex = new Map()

function addRewriteUrlRegex (sourceUrl, targetUrl) {
  global.rewriteUrlRegex.set(new RegExp(sourceUrl, 'i'), targetUrl)
}

function getRewriteUrl (inputParam, incomingUrl) {
  const logger = inputParam.logger

  logger.debug('enter rewrite: ' + incomingUrl)
  const url = incomingUrl.split('?')
  const frontUrl = url[0]
  const backUrl = url.length > 1 ? url[1] : undefined
  let retUrl = incomingUrl
  let found = false
  for (const [sourceUrl, targetUrl] of global.rewriteUrl.entries()) {
    if (frontUrl === sourceUrl) {
      retUrl = targetUrl
      found = true
    } else {
      const actualToken = frontUrl.split('/')
      const sourceUrlToken = sourceUrl.split('/')
      if (actualToken.length === sourceUrlToken.length) {
        const paramList = []
        for (let index = 0; index < sourceUrlToken.length; index++) {
          const item = sourceUrlToken[index]
          const match = require('./httpUtil').placeHolderRe.exec(item)
          if (match !== null) {
            found = true
            paramList.push(actualToken[index])
          } else if (item !== actualToken[index]) {
            found = false
            break
          } else {
            found = true
          }
        }
        if (found) {
          let actualTarget = targetUrl
          paramList.forEach((item, index) => {
            actualTarget = actualTarget.replace('$' + String(index + 1), item)
          })
          retUrl = actualTarget
        }
      }
    }
    if (found) break
  }

  if (found && backUrl !== undefined) {
    retUrl = retUrl + '?' + backUrl
  } else if (!found) {
    retUrl = getRewriteUrlRegex(inputParam, retUrl)
  }
  logger.debug('exit rewrite: ' + retUrl)
  return retUrl
}

function getRewriteUrlRegex (inputParam, incomingUrl) {
  const logger = inputParam.logger

  logger.debug('enter rewrite regex: ' + incomingUrl)
  const url = incomingUrl.split('?')
  const frontUrl = url[0]
  const backUrl = url.length > 1 ? url[1] : undefined
  let retUrl = incomingUrl
  let found = false
  for (const [sourceUrlRegex, targetUrl] of global.rewriteUrlRegex.entries()) {
    if (sourceUrlRegex.test(frontUrl)) {
      retUrl = targetUrl
      found = true
      break
    }
  }
  if (found && backUrl !== undefined) {
    retUrl = retUrl + '?' + backUrl
  }
  logger.debug('exit rewrite regex: ' + retUrl)
  return retUrl
}

module.exports = {
  addRewriteUrl,
  addRewriteUrlRegex,
  addRewriteUrlPathParam,
  getRewriteUrl,
  getRewriteUrlRegex
}
