const process = require('process')
const path = require('path')
const httpUtil = require(process.cwd() + path.sep + 'util/http/httpUtil')

class MyCompanyChainHandler extends httpUtil.Handler {
  constructor () {
    super()
  }

  handle (req, res) {
    res.write(this.name + '\n')
    if (!this.execNextHandlerFlag) {
      res.end()
    }
    return this.execNextHandlerFlag
  }
}

module.exports = {
  MyCompanyChainHandler
}
