const mongoose = require("mongoose");

const { Schema } = mongoose;

const jobSchema = new mongoose.Schema(
	{
        nodeId: { type: Schema.Types.ObjectId, ref: 'Node', required: true },
        workerId: { type: Schema.Types.ObjectId, ref: 'Worker', required: true },
		input: { type: String, required: true },
		outputs: { type: String, required: true },
		callback: { type: String, required: true },
		status: { type: String, required: false },
		progress: { type: String, required: false },
        //updated_at: { type: Date },
        //created_at: { type: Date }
	},
	{ 
        timestamps: { 
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
);

/*
jobSchema.pre('save', function(next){
    this.updated_at = new Date();
    if (!this.created_at) {
        this.created_at = this.updated_at;
    }
    next();
});
*/

module.exports = mongoose.model("Job", jobSchema);
