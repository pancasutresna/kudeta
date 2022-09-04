import request from 'supertest';
import { app } from '../../app';

it('return a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password',
        })
        .expect(400);
});

it('return a 400 with an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'p',
        })
        .expect(400);
});

it('return a 400 with missing email and password', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password',
        })
        .expect(400);
});

it('fails when a email that does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'notexist@test.com',
            password: 'password',
        })
        .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'exist@test.com',
            password: 'password',
        })
        .expect(201);

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'exist@test.com',
            password: 'wrong_password',
        })
        .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'exist@test.com',
            password: 'password',
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'exist@test.com',
            password: 'password',
        })
        .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
});
