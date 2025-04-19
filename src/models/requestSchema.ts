import mongoose, {model, models, Schema} from 'mongoose';

const requestSchema = new Schema ({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    accept: {
        type: Boolean,
        default: false,
    },
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Request = models.Request ||  mongoose.model('Request', requestSchema);
export default Request;

