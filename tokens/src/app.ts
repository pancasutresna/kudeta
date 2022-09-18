import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@kudeta.app/common';
import { createTokenRouter } from './routes/new';
import { showTokenRouter } from './routes/show';
import { indexTokenRouter } from './routes';
import { updateTokenRouter } from './routes/update';

// console.log('RUNNING KUDETA.APP-SERVICE');
// console.log('======================');
// console.log('NODE_ENV : ' + process.env.NODE_ENV);

const app = express().disable('x-powered-by');
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test', // set secure only in production environment
    })
);

app.use(currentUser);

app.use(createTokenRouter);
app.use(showTokenRouter);
app.use(indexTokenRouter);
app.use(updateTokenRouter);

app.all('*', async (req, res) => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app };
