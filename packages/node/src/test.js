require("dotenv").config();
const VoltajNode = require("./index");

const voltajNode = new VoltajNode();
console.log('voltaj node server db info:', voltajNode.getDatabaseInfo());
voltajNode.run();