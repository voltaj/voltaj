const os = require('os');
const Server = require('../models/server.model');
const serverConstants = require('../constants/server.constants');

const serverService = {};

serverService.initServer = async ({ interval = false, options }) => {
	await serverService.createOrUpdateServer({
		address: os.hostname(),
		status: serverConstants.status.ACTIVE
	});

	if(interval){
		setInterval(() => serverService.initServer, options.healthPollingIntervalMs); // during 5 min
	}
}

serverService.killServer = async () => {
	await serverService.createOrUpdateServer({
		address: os.hostname(),
		status: serverConstants.status.DEAD
	});
}

serverService.getCurrentServer = async () => {
	return Server.findOne({ address: os.hostname() });
}

serverService.getServerById = async (id) => {
	return Server.findById(id);
}

serverService.getServers = async () => {
	return Server.find();
}

serverService.createServer = async (data) => {
	return Server.create(data);
};

serverService.createOrUpdateServer = async (data) => {
	const existingServer = await Server.findOne({ address: data.address });

	if(existingServer){
		return serverService.updateServer(existingServer, data);
	} 

	return serverService.createServer(data);
};

serverService.updateServer = async (server, effectedProps) => {
	return Server.findByIdAndUpdate(server, effectedProps);
};

serverService.deleteServerById = async (serverId) => {
	const server = await serverService.getServerById(serverId);

	if(!server){
		throw new Error("Server not found");
	}

	await server.remove();

	return server;
}

module.exports = serverService;