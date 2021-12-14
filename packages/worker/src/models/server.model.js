const mongoose = require('mongoose');

const serverModel = new mongoose.Schema(
	{
        address: { type: String, unique: true, required: true },
		status: { type: String, required: true }
	},
	{ 
        timestamps: true
    }
);

module.exports = mongoose.model("Server", serverModel);
