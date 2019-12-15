const process = require('process')
const path = require('path')
const httpUtil = require(process.cwd() + path.sep + 'util/http/httpUtil')

class MyCompanyPathParamHandler extends httpUtil.PathParamHandler {
  constructor () {
    super()
  }

  handle (req, res, paramMap) { // make sure this method return boolean if use as ChainHandler
    res.writeHead(200, { Server: 'puma', 'Content-Type': 'text/plain' })
    res.write(this.name + '\n')
    res.write(JSON.stringify(paramMap, null, 2) + '\n')
    res.end()
  }
}

module.exports = {
  MyCompanyPathParamHandler
}
