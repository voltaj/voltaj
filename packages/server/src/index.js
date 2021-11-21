const config = require("./config");
const api = require("./api");
const database = require("./utils/database");

class VoltajNode {
    constructor(extraConfig){
        this.config = { ...config, ...(extraConfig || {}) };
    }

    getDatabaseInfo(){
        return this.config.database;
    }

    run(){
        // database connect
        database.connect(this.config.database);
        
        // api start
        api.start(this.config.http);
    }

    stop(){
        api.stop();
        database.disconnect();
        //clearInterval(app.intervalTimer);
        process.exit();
    }
}

module.exports = VoltajNode;