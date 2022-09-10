import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import { param, check, validationResult } from 'express-validator';
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@kudeta.app/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/orders/:orderId',
    [param('orderId').not().isEmpty().trim().escape()],
    validateRequest,
    requireAuth,
    async (req: Request, res: Response) => {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('ticket');

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        order.status = OrderStatus.Cancelled;
        await order.save();

        // publish event
        new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,
            },
        });

        // file deepcode ignore XSS: req.params.orderId is already filtered
        res.status(204).send(order);
    }
);

export { router as deleteOrderRouter };
