const process = require('process')
const path = require('path')
const httpUtil = require(process.cwd() + path.sep + 'util/http/httpUtil')

class MyCompanyChainPathParamHandler extends httpUtil.PathParamHandler {
  constructor () {
    super()
  }

  handle (req, res, paramMap) {
    res.write(this.name + '\n')
    res.write(JSON.stringify(paramMap, null, 2) + '\n')
    if (!this.execNextHandlerFlag) {
      res.end()
    }
    return this.execNextHandlerFlag
  }
}

module.exports = {
  MyCompanyChainPathParamHandler
}
