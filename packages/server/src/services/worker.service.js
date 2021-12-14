const Worker = require('@app/models/worker.model');
const workerConstants = require('@app/constants/worker.constants');

const workerService = {};

workerService.getAll = async (filter) => {
	return Worker.find(filter);
}

workerService.getById = async (id) => {
	return Worker.findById(id);
}

workerService.create = async (data) => {
	return Worker.create({
		status: workerConstants.status.IDLE,
		index: 1,
		...data
	});
};

workerService.createOrUpdate = async (data) => {
	const existingWorker = await Worker.findOne({ serverId: data.serverId });

	if(existingWorker){
		return workerService.updateById(existingWorker.id, data);
	} 

	return workerService.create(data);
};


workerService.updateAll = async (filter, update) => {
	return Worker.updateMany(filter, update)
};

workerService.updateById = async (id, data) => {
	return Worker.findByIdAndUpdate(id, data);
};

workerService.updateStatusById = async (id, status) => {
	return Worker.findByIdAndUpdate(id, { status });
};

workerService.deleteById = async (workerId) => {
	const worker = await workerService.getById(workerId);

	if(!worker){
		throw new Error("Worker not found");
	}

	await worker.remove();

	return worker;
}

workerService.deleteWorkersByServerId = (serverId) => {
	return Worker.deleteMany({ serverId })
}

module.exports = workerService;