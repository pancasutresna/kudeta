import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@kudeta.app/common';
import { Token } from '../models/token';
import { TokenCreatedPublisher } from '../events/publishers/token-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/tokens',
    requireAuth,
    [
        body('title').not().isEmpty().withMessage('Title is required'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('Price must be greater than 0'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { title, price } = req.body;
        const token = Token.build({
            title,
            price,
            userId: req.currentUser!.id,
        });

        await token.save();

        new TokenCreatedPublisher(natsWrapper.client).publish({
            id: token.id,
            version: token.version,
            title: token.title,
            price: token.price,
            userId: token.userId,
        });

        res.status(201).send(token);
    }
);

export { router as createTokenRouter };
