import { NotFoundError } from '@kudeta.app/common';
import express, { Request, Response } from 'express';
import { Token } from '../models/token';

const router = express.Router();

router.get('/api/tokens/:id', async (req: Request, res: Response) => {
    const tokenId = escape(req.params.id);

    const token = await Token.findById(tokenId);

    if (!token) {
        throw new NotFoundError();
    }

    res.send(token);
});

export { router as showTokenRouter };
