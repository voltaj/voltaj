const mongoose = require('mongoose');

const workerModel = new mongoose.Schema(
	{
		serverId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Servers', required: true },
		index: { type: Number, required: true },
		status: { type: String, required: true }
	},
	{ 
        timestamps: true
    }
);

module.exports = mongoose.model("Worker", workerModel);
