import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    communityName: {
        type: String,
        required: true,
    },
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Plant",
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    location:{
        type:{
            type: String,
            enum:["Point"],
            default:"Point",
        },
        coordinates:{
            type:[Number],
            required: true,
        },
    }
})

//Add the 2dsphere index here
communitySchema.index({ location: "2dsphere" });


const Community = mongoose.models.Community || mongoose.model('Community',communitySchema);

export default Community;