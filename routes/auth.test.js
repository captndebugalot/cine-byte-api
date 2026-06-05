

import request from 'supertest';
import server from '../server';
import * as testUtils from '../testUtils';
import models from '../models';



describe('/auth', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user0 = {
    email: 'user0@mail.com',
    password: '123password',
  };


  describe('POST /auth/signup', () => {
    it('should return 400 without a password', async () => {
      const res = await request(server)
        .post('/auth/signup')
        .send({ email: user0.email });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 200 with valid email and password', async () => {
      const res = await request(server)
        .post('/auth/signup')
        .send(user0);
      expect(res.statusCode).toEqual(200);
    });

    it('should return 409 with duplicate email', async () => {
      await request(server).post('/auth/signup').send(user0);
      const res = await request(server).post('/auth/signup').send(user0);
      expect(res.statusCode).toEqual(409);
    });

    it('should not store raw password', async () => {
      await request(server).post('/auth/signup').send(user0);
      const users = await models.User.find().lean();
      users.forEach((user) => {
        expect(Object.values(user)).not.toContain(user0.password);
      });
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await request(server).post('/auth/signup').send(user0);
    });

    it('should return 400 without a password', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: user0.email });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 401 with wrong password', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send({ email: user0.email, password: 'wrongpassword' });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and a token with correct credentials', async () => {
      const res = await request(server)
        .post('/auth/login')
        .send(user0);
      expect(res.statusCode).toEqual(200);
      expect(typeof res.body.token).toEqual('string');
    });
  });

  describe('PUT /auth/password', () => {
    let token;

    beforeEach(async () => {
      await request(server).post('/auth/signup').send(user0);
      const res = await request(server).post('/auth/login').send(user0);
      token = res.body.token;
    });

    it('should return 401 with no token', async () => {
      const res = await request(server)
        .put('/auth/password')
        .send({ password: 'newpassword' });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 400 with empty password', async () => {
      const res = await request(server)
        .put('/auth/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: '' });
      expect(res.statusCode).toEqual(400);
    });

    it('should return 200 and update password', async () => {
      const res = await request(server)
        .put('/auth/password')
        .set('Authorization', `Bearer ${token}`)
        .send({ password: 'newpassword123' });
      expect(res.statusCode).toEqual(200);

      // verify old password no longer works
      const loginRes = await request(server)
        .post('/auth/login')
        .send(user0);
      expect(loginRes.statusCode).toEqual(401);

      // verify new password works
      const newLoginRes = await request(server)
        .post('/auth/login')
        .send({ email: user0.email, password: 'newpassword123' });
      expect(newLoginRes.statusCode).toEqual(200);
    });
  });
});