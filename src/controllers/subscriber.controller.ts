import { HydratedDocument } from 'mongoose'
import { IGetSubscribersResponse } from '../types/get-subscribers-response.types'
import { IPaginationValues } from '../types/pagination-values.types'
import { ISubscriber } from '../types/subscriber.types'
import { ParsedQs } from 'qs'
import { Request, Response } from 'express'
import { Subscriber } from '../models/subscriber.models.js'

class SubscriberController {
  DEFAULT_PAGINATION_VALUES: IPaginationValues = {
    currentPage: 1,
    perPage: 25,
  }

  SUBSCRIBER_ID_LENGTH = 24 // default length of mongoose IDs

  public async get(request: Request, response: Response): Promise<void> {
    const subscriberID = request.params.id

    const [isIdValid, idError] = this.isSubscriberIdValid(subscriberID)

    if (!isIdValid) {
      response.status(400).json({ error: idError })
      return
    }

    const [subscriber, httpStatusCode, errorMessage] = await this.getSubscriber(subscriberID)

    if (!subscriber) {
      response.status(httpStatusCode).json({ error: errorMessage })
      return
    }

    response.status(200).json({ subscriber })
  }

  public async getAll(request: Request, response: Response): Promise<void> {
    let subscriberCount = 0

    try {
      subscriberCount = await Subscriber.count()
    } catch (error) {
      response.status(500).json({ error })
      return
    }

    const { currentPage, perPage }: IPaginationValues = this.parsePaginationValuesFromQuery(
      request.query
    )

    const pageCount = Math.ceil(subscriberCount / perPage)

    const finalCurrentPageValue = currentPage > pageCount ? pageCount : currentPage

    const skipValue = (finalCurrentPageValue - 1) * perPage

    let subscribers: ISubscriber[] = []

    try {
      subscribers = await Subscriber.find().skip(skipValue).limit(perPage)
    } catch (error) {
      response.status(500).json({ error })
      return
    }

    const getAllResponse: IGetSubscribersResponse = {
      currentPage: finalCurrentPageValue,
      pageCount,
      perPage,
      subscriberCount,
      subscribers,
    }

    response.status(200).json(getAllResponse)
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { name, subscribedToChannel } = request.body

    const [areSubscriberPropertiesValid, subscriberPropertiesError] =
      this.areSubscriberPropertiesValid(name, subscribedToChannel)

    if (!areSubscriberPropertiesValid) {
      response.status(400).json({ error: subscriberPropertiesError })
      return
    }

    const subscriber: HydratedDocument<ISubscriber> = new Subscriber({
      name,
      subscribedToChannel,
    })

    let createdSubscriber: ISubscriber | null = null

    try {
      createdSubscriber = await subscriber.save()
    } catch (error) {
      response.status(500).json({ error })
      return
    }

    response.status(201).json({
      message: 'Subscriber created',
      createdSubscriber,
    })
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const subscriberID = request.params.id

    const [isIdValid, idError] = this.isSubscriberIdValid(subscriberID)

    if (!isIdValid) {
      response.status(400).json({ error: idError })
      return
    }

    const [subscriber, httpStatusCode, errorMessage] = await this.getSubscriber(subscriberID)

    if (!subscriber) {
      response.status(httpStatusCode).json({ error: errorMessage })
      return
    }

    try {
      await subscriber.deleteOne()
    } catch (error) {
      response.status(500).json({ error })
      return
    }

    response.status(200).json({ message: 'Subscriber successfully deleted', subscriber })
  }

  private isSubscriberIdValid(subscriberID: string): [boolean, string?] {
    if (!subscriberID) {
      return [false, 'Path parameter missing: subscriberID']
    }

    if (subscriberID.length !== this.SUBSCRIBER_ID_LENGTH) {
      return [
        false,
        `Expected subscriber ID length to be ${this.SUBSCRIBER_ID_LENGTH} but received ${subscriberID.length}`,
      ]
    }

    return [true]
  }

  private async getSubscriber(
    subscriberID: string
  ): Promise<[HydratedDocument<ISubscriber>, null, null] | [null, number, string]> {
    let subscriber: HydratedDocument<ISubscriber> | null = null

    try {
      subscriber = await Subscriber.findById(subscriberID)
    } catch (error) {
      return [null, 500, error]
    }

    if (!subscriber) {
      return [null, 404, `Subscriber with ID ${subscriberID} doesn't exist`]
    }

    return [subscriber, null, null]
  }

  private areSubscriberPropertiesValid(
    name: string,
    subscribedToChannel: string
  ): [boolean, string?] {
    if (!name) {
      return [false, 'Request body value missing: name']
    }

    if (!subscribedToChannel) {
      return [false, 'Request body value missing: subscribedToChannel']
    }

    if (typeof name !== 'string') {
      return [
        false,
        `Expected request body value 'name' to be a string but received ${typeof name}`,
      ]
    }

    if (typeof subscribedToChannel !== 'string') {
      return [
        false,
        `Expected request body value 'subscribedToChannel' to be a string but received ${typeof subscribedToChannel}`,
      ]
    }

    return [true]
  }

  private parsePaginationValuesFromQuery(requestQueryObject: ParsedQs): IPaginationValues {
    const queryPage = requestQueryObject.page as string
    const queryPerPage = requestQueryObject.perPage as string

    const page = Math.abs(parseInt(queryPage))
    const perPage = Math.abs(parseInt(queryPerPage))

    return {
      currentPage: page || this.DEFAULT_PAGINATION_VALUES.currentPage,
      perPage: perPage || this.DEFAULT_PAGINATION_VALUES.perPage,
    }
  }
}

export default new SubscriberController()
