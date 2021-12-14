const Server = require('@app/models/server.model');
const serverConstants = require('@app/constants/server.constants');
const workerService = require('@app/services/worker.service');
const workerConstants = require('@app/constants/worker.constants');

const serverService = {};

serverService.initialize = ({ address }) => {
	return new Promise(async (resolve, rejected) => {
		try{
			// get server data
			const server = await serverService.createOrUpdate({
				address,
				status: serverConstants.status.ACTIVE
			});

			// change workers status
			await workerService.updateAll({
				serverId: server.id
			}, {
				$set: {
					status: workerConstants.status.DEAD
				}
			});

			// send server data
			resolve(server);
		} catch(err){
			rejected(err);
		}
	})
}

serverService.kill = async ({ address }) => {
	// change server status like "DEAD"
	const server = await serverService.createOrUpdate({
		address,
		status: serverConstants.status.DEAD
	});

	// change workers status
	await workerService.updateAll({
		serverId: server.id
	}, {
		$set: {
			status: workerConstants.status.DEAD
		}
	});
}

serverService.getCurrent = async (data) => {
	return Server.findOne(data);
}

serverService.getById = async (id) => {
	return Server.findById(id);
}

serverService.getAll = async (filter) => {
	return Server.find(filter);
}

serverService.create = async (data) => {
	return Server.create(data);
};

serverService.createOrUpdate = async (data) => {
	const existingServer = await Server.findOne({ address: data.address });

	if(existingServer){
		return serverService.update(existingServer, data);
	} 

	return serverService.create(data);
};

serverService.update = async (server, effectedProps) => {
	return Server.findByIdAndUpdate(server, effectedProps);
};

serverService.updateAll = async (filter, update) => {
	return Server.updateMany(filter, update)
};

serverService.deleteById = async (serverId) => {
	const server = await serverService.getById(serverId);

	if(!server){
		throw new Error("Server not found");
	}

	await server.remove();

	return server;
}

module.exports = serverService;