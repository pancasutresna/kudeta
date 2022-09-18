import request from 'supertest';
import { app } from '../../app';
import mongoose, { mongo } from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Token } from '../../models/token';

it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tokens/${id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'token title',
            price: 20,
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
        .put(`/api/tokens/${id}`)
        .send({
            title: 'token title',
            price: 20,
        })
        .expect(401);
});

it('returns a 401 if the user does not own the token', async () => {
    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'token title',
            price: 20,
        });

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'new title',
            price: 1000,
        })
        .expect(401);
});

it('returns a 400 if the user provided an invalid title or price', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', cookie)
        .send({
            title: 'the title',
            price: 20,
        });

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: 20,
        })
        .expect(400);

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: -10,
        })
        .expect(400);

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
        })
        .expect(400);
});

it('updates the token provided valid inputs', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', cookie)
        .send({
            title: 'the title',
            price: 20,
        });

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 50,
        })
        .expect(200);

    const tokenResponse = await request(app)
        .get(`/api/tokens/${response.body.id}`)
        .send();

    expect(tokenResponse.body.title).toEqual('new title');
    expect(tokenResponse.body.price).toEqual(50);
});

it('publishes an event', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', cookie)
        .send({
            title: 'the title',
            price: 20,
        });

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 50,
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the token is reserved', async () => {
    const cookie = global.signin();

    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', cookie)
        .send({
            title: 'the title',
            price: 20,
        });

    const token = await Token.findById(response.body.id);
    token!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await token!.save();

    await request(app)
        .put(`/api/tokens/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 50,
        })
        .expect(400);
});
