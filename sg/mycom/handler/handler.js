const process = require('process')
const path = require('path')
const httpUtil = require(process.cwd() + path.sep + 'util/http/httpUtil')

class MyCompanyHandler extends httpUtil.Handler {
  constructor () {
    super()
  }

  handle (req, res) {
    res.writeHead(200, { Server: 'puma', 'Content-Type': 'text/plain; charset=utf-8' })
    res.write(this.name)
    res.write('\n' + 'Hello world')
    res.end()
  }
}

module.exports = {
  MyCompanyHandler
}
