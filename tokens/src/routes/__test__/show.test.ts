import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns 404 if the token is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app).get(`/api/tokens/${id}`).send().expect(404);
});

it('returns the token if the token is found', async () => {
    const title = 'concert';
    const price = 20;

    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title,
            price,
        })
        .expect(201);

    const tokenResponse = await request(app)
        .get(`/api/tokens/${response.body.id}`)
        .send()
        .expect(200);

    expect(tokenResponse.body.title).toEqual(title);
    expect(tokenResponse.body.price).toEqual(price);
});
