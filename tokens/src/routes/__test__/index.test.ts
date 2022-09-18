import request from 'supertest';
import { app } from '../../app';

const createToken = () => {
    return request(app)
        .post('/api/tokens')
        .set('Cookie', global.signin())
        .send({
            title: 'new token',
            price: 20,
        });
};

it('can fetch a list of tokens', async () => {
    await createToken();
    await createToken();
    await createToken();

    const response = await request(app).get('/api/tokens').send().expect(200);

    expect(response.body.length).toEqual(3);
});
