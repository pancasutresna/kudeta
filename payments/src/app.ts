import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kudeta.app/common';
import { createChargeRouter } from './routes/new';

// console.log('RUNNING KUDETA.APP-SERVICE');
// console.log('======================');
// console.log('NODE_ENV : ' + process.env.NODE_ENV);

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // set secure only in production environment
    })
);

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
