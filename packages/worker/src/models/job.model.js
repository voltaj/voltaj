const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
	{
        serverId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Servers', required: true },
        workerId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Workers', required: false },
		input: { type: String, required: true },
		outputs: [
            { 
                output: { type: String },
                path: { type: String },
                resolution: { type: String },
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
                watermark: { type: String },
                url: { type: String },
                position: { type: String },
            }
        ],
		callbacks: [
            { 
                type: { type: String },
                url: { type: String },
            }
        ],
		status: { type: String, required: true },
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
