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
