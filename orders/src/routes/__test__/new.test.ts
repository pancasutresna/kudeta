import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Token } from '../../models/token';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the token does not exist', async () => {
    const tokenId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId })
        .expect(404);
});

it('returns an error if the token is already reserved', async () => {
    // create new token
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });

    await token.save();

    // create new order
    const order = Order.build({
        token: token,
        userId: 'dasdadasd',
        status: OrderStatus.Created,
        expiresAt: new Date(),
    });
    await order.save();

    // request to already registered token
    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id })
        .expect(400);
});

it('reserve a token', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await token.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id })
        .expect(201);
});

it('emits an order created event', async () => {
    const token = Token.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await token.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({ tokenId: token.id })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
