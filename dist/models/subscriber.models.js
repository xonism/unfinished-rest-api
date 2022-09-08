import mongoose from 'mongoose';
const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subscribedToChannel: {
        type: String,
        required: true,
    },
    subscribeDate: {
        type: Date,
        default: Date.now,
    },
});
// Returns only specified fields with the .json() method
subscriberSchema.set('toJSON', {
    transform: (ret) => ({
        id: ret._id,
        name: ret.name,
        subscribedToChannel: ret.subscribedToChannel,
        subscribeDate: ret.subscribeDate,
    }),
});
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
export { Subscriber };
