# puma
Node.js mini-web framework (Node.js version that must support **ES6**)

**How to use puma framework**

*Step 1*
From Windows Command Prompt or Linux terminal at puma folder type ```npm install```
This will install all the dependencies needed based on package.json

*Step 2*
Ensure config/config.json are setup correctly for your environment.

*Step 3*
Start to add your application specific code in util/http/handlerUtil.js. Refer to the extensive comments in the file to learn how to add your own handler for the url. function registerHandlers to register your handler. function startUpInit, shutdownCleanUp show small examples on how to use dbPool which interface with MySQL.

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
