global.config = undefined;

exports.Config = function() {
    if (config === undefined) {
        const fs = require('fs');
        const process = require('process');
        const path = require('path');
        
        let data = JSON.parse(fs.readFileSync(process.cwd()+path.sep+'config'+path.sep+'config.json'));
        let env = data.Env;
        config = data[env];    
    }
    return config;
};
