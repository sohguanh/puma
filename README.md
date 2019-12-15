# puma
Node.js mini-web framework (Node.js version that must support **ES6**)

**How to use puma framework**

*Step 1*
From Windows Command Prompt or Linux terminal at puma folder type ```npm install```
This will install all the dependencies needed based on package.json

*Step 2*
Ensure config/config.json are setup correctly for your environment.

*Step 3*
All application specific code are to be added inside util/http/handlerUtil.js. Refer to the extensive comments in the file to learn how to add your own handler for the url. function registerHandlers to register your handler. function startUpInit, shutdownCleanUp show small examples on how to use dbPool which interface with MySQL.

If your application specific handlers are very simple, you can configure them inside config/handlers.json. Similarly if your url rewrite rules are very simple, you can configure them inside config/urlrewrite.json

The code snippet to read from config file and register handers are in util/http/handlerUtil.js from line 218 onwards.
```
  const dataHandler = httpRewriteUtil.getHandlerRules(param)
  if (dataHandler !== undefined) {
    const process = require('process')
    const path = require('path')
    const modHandler = require(process.cwd() + path.sep + 'sg/mycom/handler/handler')
    const modChainHandler = require(process.cwd() + path.sep + 'sg/mycom/handler/chainHandler')
    const modPathParamHandler = require(process.cwd() + path.sep + 'sg/mycom/handler/pathParamHandler')
    const modChainPathParamHandler = require(process.cwd() + path.sep + 'sg/mycom/handler/chainPathParamHandler')

    dataHandler.handlers.forEach((paramValue, index) => {
      const item = paramValue
      if (['handler', 'handler_regex', 'handler_path_param'].includes(item.Mode)) {
        const handle = item.Handler[0]
        let obj = null
        if (item.Mode === 'handler') {
          obj = eval('new modHandler.' + handle.Klass + '()')
        } else if (item.Mode === 'handler_regex') {
          obj = eval('new modHandler.' + handle.Klass + '()')
        } else if (item.Mode === 'handler_path_param') {
          obj = eval('new modPathParamHandler.' + handle.Klass + '()')
        }
        handle.Attributes.forEach((val, ind) => {
          for (const key in val) {
            obj[key] = val[key]
          }
        })

        if (item.Mode === 'handler') {
          httpUtil.registerHandler(item.Url, obj, item.Methods)
        } else if (item.Mode === 'handler_regex') {
          httpUtil.registerHandlerRegex(item.Url, obj, item.Methods)
        } else if (item.Mode === 'handler_path_param') {
          httpUtil.registerHandlerPathParam(item.Url, obj, item.Methods)
        }
      } else if (['chain_handler', 'chain_handler_regex', 'chain_handler_path_param'].includes(item.Mode)) {
        const objArr = []
        item.Handler.forEach((handle, ind) => {
          let obj = null
          if (item.Mode === 'chain_handler') {
            obj = eval('new modChainHandler.' + handle.Klass + '()')
          } else if (item.Mode === 'chain_handler_regex') {
            obj = eval('new modChainHandler.' + handle.Klass + '()')
          } else if (item.Mode === 'chain_handler_path_param') {
            obj = eval('new modChainPathParamHandler.' + handle.Klass + '()')
          }
          handle.Attributes.forEach((val, ind) => {
            for (const key in val) {
              obj[key] = val[key]
            }
          })

          objArr.push(obj)
        })
        if (item.Mode === 'chain_handler') {
          httpUtil.registerChainHandler(item.Url, objArr, item.Methods)
        } else if (item.Mode === 'chain_handler_regex') {
          httpUtil.registerChainHandlerRegex(item.Url, objArr, item.Methods)
        } else if (item.Mode === 'chain_handler_path_param') {
          httpUtil.registerChainHandlerPathParam(item.Url, objArr, item.Methods)
        }
      }
    })
  }
```

The code snippet to read from config file and register url rewrite rules are in util/http/handlerUtil.js from line 283 onwards.
```
  const dataRewriteRules = httpRewriteUtil.getRewriteRules(param)
  if (dataRewriteRules !== undefined) {
    dataRewriteRules.rules.forEach((paramValue, index) => {
      const item = paramValue
      if (item.Mode === httpRewriteUtil.REWRITE_MODE.D) {
        httpRewriteUtil.addRewriteUrl(item.SourceUrl, item.TargetUrl)
      } else if (item.Mode === httpRewriteUtil.REWRITE_MODE.R) {
        httpRewriteUtil.addRewriteUrlRegex(item.SourceUrl, item.TargetUrl)
      } else if (item.Mode === httpRewriteUtil.REWRITE_MODE.P) {
        httpRewriteUtil.addRewriteUrlPathParam(item.SourceUrl, item.TargetUrl)
      }
    })
  }
```

*Step 4*
Once you get the hang of how the framework works and want to start coding from the bare minimum please refer to below.
1. Remove or move elsewhere the existing util/http/handlerUtil.js
2. Rename existing util/http/handlerUtilBare.js to util/http/handlerUtil.js
3. You can now start to code from the bare minimum

*Step 5*
For MySQL interfacing, please take note by default it is turned off at code level. Once you get MySQL up, please refer to existing ```puma.js``` The comments are quite clear on how to turn off and on. You just need to comment and uncomment the relevant lines.
- line 8        // const dbPool = require('./util/db/dbUtil').getDbPool(config) //uncomment this line once MySQL is up
- line 9        const dbPool = undefined // comment/remove this line once MySQL is up


**Different methods for registering handlers to url**
```
httpUtil.registerHandler
httpUtil.registerChainHandler
httpUtil.registerHandlerRegex
httpUtil.registerChainHandlerRegex
httpUtil.registerHandlerPathParam
httpUtil.registerChainHandlerPathParam
```

**"Interface" Class**
```
class Handler {
    constructor() {
    }    
    handle(req, res) { //make sure this method return boolean if use as ChainHandler
    }
}

class PathParamHandler {
    constructor() {
    }    
    handle(req, res, paramMap) { //make sure this method return boolean if use as ChainPathParamHandler
    }
}
```

*Step 4*
From Windows Command Prompt or Linux terminal, type <path_to_nodejs> puma.js or <path_to_nodejs> puma.js &

*Step 5*
Use a browser and navigate to your configured url in Step 1 config.json e.g ht&#8203;tp://localhost:8000
You should see a message I am alive! This mean your http server is up and running.
To shutdown, send a SIGINT signal. Ctrl-C for Windows Command Prompt. kill -SIGINT <pid> for Linux.
  
**Sample url based on the example code**

| Description | Url |
| --- | --- |
| root | ht&#8203;tp://localhost:8000 |
| handler | ht&#8203;tp://localhost:8000/hello1 |
| chainHandler | ht&#8203;tp://localhost:8000/hello2 |
| handlerRegex | ht&#8203;tp://localhost:8000/hello3/abc/123 |
| chainHandlerRegex | ht&#8203;tp://localhost:8000/hello4/abc/456  |
| handlerPathParam | ht&#8203;tp://localhost:8000/hello5/123/456 | 
| chainHandlerPathParam | ht&#8203;tp://localhost:8000/hello6/123/456 | 

**Sample rewrite url based on the example code**

You can add the url rewrite rules inside util/http/handlerUtil.js or configure them inside config/urlrewrite.json

| Source Url | Target Url |
| --- | --- |
| ht&#8203;tp://localhost:8000/test/me/1 | ht&#8203;tp://localhost:8000/hello1 |
| ht&#8203;tp://localhost:8000/test/me/2 | ht&#8203;tp://localhost:8000/hello2 |
| ht&#8203;tp://localhost:8000/test/me/3 | ht&#8203;tp://localhost:8000/hello3/abc/123 |
| ht&#8203;tp://localhost:8000/test/me/4 | ht&#8203;tp://localhost:8000/hello4/abc/456  |
| ht&#8203;tp://localhost:8000/test/me/5/123/456 | ht&#8203;tp://localhost:8000/hello5/123/456 | 
| ht&#8203;tp://localhost:8000/test/me/6/123/456 | ht&#8203;tp://localhost:8000/hello6/123/456 |

**Template Engines**

There are just too many choices for Node.js template engines that to reinvent the wheel will be a waste of time. Hence I decided not to write one from scratch for this mini-web framework.

The following is a list of important (but not limited) template engines for Node.js you can consider.

- [Pug](https://github.com/pugjs/pug)
- [Vash](https://github.com/kirbysayshi/vash)  
- [EJS](https://github.com/tj/ejs)
- [Mustache](https://github.com/janl/mustache.js)
- [Dust.js](https://github.com/linkedin/dustjs)
- [Nunjucks](https://github.com/mozilla/nunjucks)
- [Handlebars](https://github.com/wycats/handlebars.js)
- [atpl](https://github.com/soywiz/atpl.js)
- [haml](https://github.com/tj/haml.js)

**Contact**

Any bug/suggestion/feedback can mail to sohguanh@gmail.com

:leopard: :leopard: :leopard:
