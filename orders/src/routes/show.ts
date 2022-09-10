import express, { Request, Response } from 'express';
import { param, check, validationResult } from 'express-validator';
import {
    NotAuthorizedError,
    NotFoundError,
    requireAuth,
    validateRequest,
} from '@kudeta.app/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
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

        // file deepcode ignore XSS: orderId is already filtered using express-validator
        res.send(order);
    }
);

export { router as showOrderRouter };
