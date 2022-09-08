var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import SubscriberController from '../controllers/subscriber.controller.js';
const subscribersRouter = express.Router();
subscribersRouter.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () { return yield SubscriberController.getAll(request, response); }));
subscribersRouter.get('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () { return yield SubscriberController.get(request, response); }));
subscribersRouter.post('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () { return yield SubscriberController.create(request, response); }));
subscribersRouter.delete('/:id', (request, response) => __awaiter(void 0, void 0, void 0, function* () { return yield SubscriberController.delete(request, response); }));
export default subscribersRouter;
