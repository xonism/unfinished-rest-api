import express from 'express'
import SubscriberController from '../controllers/subscriber.controller.js'

const subscribersRouter = express.Router()

subscribersRouter.get(
  '/',
  async (request, response) => await SubscriberController.getAll(request, response)
)

subscribersRouter.get(
  '/:id',
  async (request, response) => await SubscriberController.get(request, response)
)

subscribersRouter.post(
  '/',
  async (request, response) => await SubscriberController.create(request, response)
)

subscribersRouter.delete(
  '/:id',
  async (request, response) => await SubscriberController.delete(request, response)
)

export default subscribersRouter
