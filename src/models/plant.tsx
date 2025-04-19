import mongoose, {models, model, Schema} from 'mongoose';

const PlantSchema = new Schema({
    name : {
        type : String,
        required: true,
    },
    dateAdded : {
        type : Date,
        default : Date.now,
    },
    age : {
        type : Number,
    },
    position : {
        type : String,
        enum : ['Indoor', 'Terrace', 'Balcony', 'Garden']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isCommunity:{
        type: Boolean,
        default: false,
    },
    handover: {
        type: Boolean,
        default: false,
    },
    nominee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Plant = models.Plant || model("Plant", PlantSchema);
export default Plant;