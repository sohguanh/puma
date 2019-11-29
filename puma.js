const http = require('http');

const config = require('./config/config').Config();
const logger = require('./util/log/logUtil').getLogger(config);
const handlerUtil = require('./util/http/handlerUtil');
const httpUtil = require('./util/http/httpUtil');

let startUpInitPromise = (config) => {
    return new Promise(function(resolve, reject) {        
        handlerUtil.startUpInit(config);        
        resolve("done");
  });
};

let registerHandlersPromise = (config) => {
    return new Promise(function(resolve, reject) {        
        handlerUtil.registerHandlers(config);        
        resolve("done");
  });
};

let start = async () => {
    await Promise.all([startUpInitPromise({ "config":config,"logger":logger }), registerHandlersPromise({ "config":config,"logger":logger })]);
};

start();

const server = http.createServer((req, res) => {
    httpUtil.process({
        "config": config,
        "logger": logger,
        "req": req,
        "res": res        
    });
});

logger.info("server starting up ...");

server.listen(config.Site.Port);

let req = http.get("http://" + config.Site.Url + ":" + config.Site.Port, (res) => {    
    logger.info('server started up ...');
}).on('error', (e) => {
    logger.error('error contact server: ${e.message}');    
});
req.setTimeout(config.Site.CheckAliveTimeoutSec*1000);
