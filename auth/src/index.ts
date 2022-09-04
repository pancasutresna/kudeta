import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
    console.log('Auth is Starting up....');

    try {
        if (!process.env.JWT_KEY) {
            throw new Error('Environment Variable JWT_KEY must be defined');
        }

        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI must be defined');
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('CONNECTED TO DATABASE');
    } catch (err) {
        console.error(err);
    }

    app.listen(3000, () => {
        console.log('LISTENING ON PORT 3000!');
    });
};

start();
