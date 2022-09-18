import mongoose, { mongo } from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
    BadRequestError,
    NotFoundError,
    OrderStatus,
    requireAuth,
    validateRequest,
} from '@kudeta.app/common';

import { Token } from '../models/token';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
    '/api/orders',
    requireAuth,
    [
        body('tokenId')
            .not()
            .isEmpty()
            .trim()
            .escape()
            //check for mongodb ID format, assuming other services also built using mongodb database
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('TokenId must be provided'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Find the token the user is trying to order in the database
        const { tokenId } = req.body;
        const token = await Token.findById(tokenId);
        if (!token) {
            throw new NotFoundError();
        }

        // Make sure that this token is not already reserved
        const isReserved = await token.isReserved();
        if (isReserved) {
            throw new BadRequestError('Token is already reserved');
        }

        // Calculate expiration date for this order
        const expiration = new Date();
        expiration.setSeconds(
            expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
        );

        // Build the order and save it to the database
        const order = Order.build({
            userId: req.currentUser!.id,
            status: OrderStatus.Created,
            expiresAt: expiration,
            token: token,
        });
        await order.save();

        // TODO: Publish an event saying that an order was created
        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            token: {
                id: token.id,
                price: token.price,
            },
        });

        // file deepcode ignore XSS: tokenId is already filtered in line using express-validator
        res.status(201).send(order);
    }
);

export { router as newOrderRouter };
