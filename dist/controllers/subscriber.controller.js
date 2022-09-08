var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Subscriber } from '../models/subscriber.models.js';
class SubscriberController {
    constructor() {
        this.DEFAULT_PAGINATION_VALUES = {
            currentPage: 1,
            perPage: 25,
        };
        this.SUBSCRIBER_ID_LENGTH = 24; // default length of mongoose IDs
    }
    get(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriberID = request.params.id;
            const [isIdValid, idError] = this.isSubscriberIdValid(subscriberID);
            if (!isIdValid) {
                response.status(400).json({ error: idError });
                return;
            }
            const [subscriber, httpStatusCode, errorMessage] = yield this.getSubscriber(subscriberID);
            if (!subscriber) {
                response.status(httpStatusCode).json({ error: errorMessage });
                return;
            }
            response.status(200).json({ subscriber });
        });
    }
    getAll(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriberCount = 0;
            try {
                subscriberCount = yield Subscriber.count();
            }
            catch (error) {
                response.status(500).json({ error });
                return;
            }
            const { currentPage, perPage } = this.parsePaginationValuesFromQuery(request.query);
            const pageCount = Math.ceil(subscriberCount / perPage);
            const finalCurrentPageValue = currentPage > pageCount ? pageCount : currentPage;
            const skipValue = (finalCurrentPageValue - 1) * perPage;
            let subscribers = [];
            try {
                subscribers = yield Subscriber.find().skip(skipValue).limit(perPage);
            }
            catch (error) {
                response.status(500).json({ error });
                return;
            }
            const getAllResponse = {
                currentPage: finalCurrentPageValue,
                pageCount,
                perPage,
                subscriberCount,
                subscribers,
            };
            response.status(200).json(getAllResponse);
        });
    }
    create(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, subscribedToChannel } = request.body;
            const [areSubscriberPropertiesValid, subscriberPropertiesError] = this.areSubscriberPropertiesValid(name, subscribedToChannel);
            if (!areSubscriberPropertiesValid) {
                response.status(400).json({ error: subscriberPropertiesError });
                return;
            }
            const subscriber = new Subscriber({
                name,
                subscribedToChannel,
            });
            let createdSubscriber = null;
            try {
                createdSubscriber = yield subscriber.save();
            }
            catch (error) {
                response.status(500).json({ error });
                return;
            }
            response.status(201).json({
                message: 'Subscriber created',
                createdSubscriber,
            });
        });
    }
    delete(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriberID = request.params.id;
            const [isIdValid, idError] = this.isSubscriberIdValid(subscriberID);
            if (!isIdValid) {
                response.status(400).json({ error: idError });
                return;
            }
            const [subscriber, httpStatusCode, errorMessage] = yield this.getSubscriber(subscriberID);
            if (!subscriber) {
                response.status(httpStatusCode).json({ error: errorMessage });
                return;
            }
            try {
                yield subscriber.deleteOne();
            }
            catch (error) {
                response.status(500).json({ error });
                return;
            }
            response.status(200).json({ message: 'Subscriber successfully deleted', subscriber });
        });
    }
    isSubscriberIdValid(subscriberID) {
        if (!subscriberID) {
            return [false, 'Path parameter missing: subscriberID'];
        }
        if (subscriberID.length !== this.SUBSCRIBER_ID_LENGTH) {
            return [
                false,
                `Expected subscriber ID length to be ${this.SUBSCRIBER_ID_LENGTH} but received ${subscriberID.length}`,
            ];
        }
        return [true];
    }
    getSubscriber(subscriberID) {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriber = null;
            try {
                subscriber = yield Subscriber.findById(subscriberID);
            }
            catch (error) {
                return [null, 500, error];
            }
            if (!subscriber) {
                return [null, 404, `Subscriber with ID ${subscriberID} doesn't exist`];
            }
            return [subscriber, null, null];
        });
    }
    areSubscriberPropertiesValid(name, subscribedToChannel) {
        if (!name) {
            return [false, 'Request body value missing: name'];
        }
        if (!subscribedToChannel) {
            return [false, 'Request body value missing: subscribedToChannel'];
        }
        if (typeof name !== 'string') {
            return [
                false,
                `Expected request body value 'name' to be a string but received ${typeof name}`,
            ];
        }
        if (typeof subscribedToChannel !== 'string') {
            return [
                false,
                `Expected request body value 'subscribedToChannel' to be a string but received ${typeof subscribedToChannel}`,
            ];
        }
        return [true];
    }
    parsePaginationValuesFromQuery(requestQueryObject) {
        const queryPage = requestQueryObject.page;
        const queryPerPage = requestQueryObject.perPage;
        const page = Math.abs(parseInt(queryPage));
        const perPage = Math.abs(parseInt(queryPerPage));
        return {
            currentPage: page || this.DEFAULT_PAGINATION_VALUES.currentPage,
            perPage: perPage || this.DEFAULT_PAGINATION_VALUES.perPage,
        };
    }
}
export default new SubscriberController();
