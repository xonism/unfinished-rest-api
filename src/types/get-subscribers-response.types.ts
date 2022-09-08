import { IPaginationValues } from '../types/pagination-values.types'
import { ISubscriber } from './subscriber.types'

export interface IGetSubscribersResponse extends IPaginationValues {
  pageCount: number
  subscriberCount: number
  subscribers: ISubscriber[]
}
