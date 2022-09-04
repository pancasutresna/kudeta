import express, { Request, Response } from 'express';
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
} from '@kudeta.app/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
    '/api/orders/:orderId',
    requireAuth,
    async (req: Request, res: Response) => {
        //TODO: validate orderId parameter to check wether it is not empty and meet specific format for order Id
        const order = await Order.findById(req.params.orderId).populate(
            'ticket'
        );

        if (!order) {
            throw new NotFoundError();
        }

        if (order.userId !== req.currentUser!.id) {
            throw new NotAuthorizedError();
        }

        res.send(order);
    }
);

export { router as showOrderRouter };
