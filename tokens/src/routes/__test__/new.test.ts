import request from 'supertest';
import { app } from '../../app';
import { Token } from '../../models/token';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tokens for post requests', async () => {
    const response = await request(app).post('/api/tokens').send({});

    expect(response.status).not.toEqual(404);
});

it('Can only be accessed if the user is signed in', async () => {
    const response = await request(app).post('/api/tokens').send({});

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const response = await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: '',
            price: 10,
        })
        .expect(400);

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            price: 10,
        })
        .expect(400);
});

it('returns an error if an invalid price is provided', async () => {
    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'the title',
            price: -10,
        })
        .expect(400);

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'the title',
        })
        .expect(400);
});

it('creates a token with valid inputs', async () => {
    // check to make sure a token was saved
    let tokens = await Token.find({});
    expect(tokens.length).toEqual(0);

    const title = 'The Title';

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20,
        })
        .expect(201);

    tokens = await Token.find({});
    expect(tokens.length).toEqual(1);
    expect(tokens[0].price).toEqual(20);
    expect(tokens[0].title).toEqual(title);
});

it('publish an event', async () => {
    const title = 'testing title';

    await request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title,
            price: 20,
        })
        .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
