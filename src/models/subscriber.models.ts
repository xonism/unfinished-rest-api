import mongoose from 'mongoose'
import { ISubscriber } from '../types/subscriber.types'

const subscriberSchema = new mongoose.Schema<ISubscriber>({
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
})

// Returns only specified fields with the .json() method
subscriberSchema.set('toJSON', {
  transform: (ret) => ({
    id: ret._id,
    name: ret.name,
    subscribedToChannel: ret.subscribedToChannel,
    subscribeDate: ret.subscribeDate,
  }),
})

const Subscriber = mongoose.model<ISubscriber>('Subscriber', subscriberSchema)

export { Subscriber }
