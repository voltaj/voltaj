const mongoose = require('mongoose');
const jobConstants = require('@app/constants/job.constants');

const jobSchema = new mongoose.Schema(
	{
        serverId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Servers', required: true },
        workerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Workers', required: false },
		input: { type: String, required: true },
		outputs: [
            { 
                path: { type: String },
                format: { type: String, required: true },
                resolution: { type: String, required: true },
                duration: { type: String },
                offset: { type: String },
                video_codec: { type: String },
                video_bitrate: { type: String },
                video_fps: { type: String },
                video_profile: { type: String },
                audio_codec: { type: String },
                audio_bitrate: { type: String },
                audio_sample_rate: { type: String },
                audio_channel: { type: String },
                quality: { type: String },
                fit: { type: String },
                transpose: { type: String },
                vflip: { type: String },
                hflip: { type: String },
                watermark: {
                    url: { type: String },
                    position: { type: String },
                },
            }
        ],
		callbacks: [
            { 
                type: { type: String, required: true },
                url: { type: String, required: true },
                requests: [
                    {
                        status: { type: Number },
                        data: { type: mongoose.SchemaTypes.Mixed },
                        response: { type: mongoose.SchemaTypes.Mixed },
                        error: { type: String },
                    }
                ]
            }
        ],
		status: { type: String, required: true, default: jobConstants.status.WAITING },
		statusMessage: { type: String, required: false },
		progress: { type: String, required: false }
	},
	{ 
        timestamps: true
        //timestamps: { 
        //    createdAt: 'created_at',
        //    updatedAt: 'updated_at'
        //}
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
