import request from 'supertest';
import server from '../server';
import * as testUtils from '../testUtils';
import models from '../models';

describe('/reviews', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user0 = { email: 'user0@mail.com', password: '123password' };
  const user1 = { email: 'user1@mail.com', password: '456password' };

  let token0;
  let token1;
  let savedMovie;

  beforeEach(async () => {
    await request(server).post('/auth/signup').send(user0);
    const res0 = await request(server).post('/auth/login').send(user0);
    token0 = res0.body.token;

    await request(server).post('/auth/signup').send(user1);
    const res1 = await request(server).post('/auth/login').send(user1);
    token1 = res1.body.token;

    savedMovie = await models.Movie.create({
      title: 'Test Movie',
      genre: 'Horror',
      year: 2021,
      director: 'Max',
    });
  });

  describe('POST /reviews', () => {
    it('should return 401 without token', async () => {
      const res = await request(server)
        .post('/reviews')
        .send({ text: 'Great!', rating: 5, movieId: savedMovie._id });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and create review', async () => {
      const res = await request(server)
        .post('/reviews')
        .set('Authorization', `Bearer ${token0}`)
        .send({ text: 'Great!', rating: 5, movieId: savedMovie._id });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({ text: 'Great!', rating: 5 });
    });
  });

  describe('GET /reviews', () => {
    beforeEach(async () => {
      await request(server)
        .post('/reviews')
        .set('Authorization', `Bearer ${token0}`)
        .send({ text: 'User0 review', rating: 5, movieId: savedMovie._id });

      await request(server)
        .post('/reviews')
        .set('Authorization', `Bearer ${token1}`)
        .send({ text: 'User1 review', rating: 3, movieId: savedMovie._id });
    });

    it('should return 401 without token', async () => {
      const res = await request(server).get('/reviews');
      expect(res.statusCode).toEqual(401);
    });

    it('should return only user0 reviews', async () => {
      const res = await request(server)
        .get('/reviews')
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].text).toEqual('User0 review');
    });

    it('should return only user1 reviews', async () => {
      const res = await request(server)
        .get('/reviews')
        .set('Authorization', `Bearer ${token1}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
      expect(res.body[0].text).toEqual('User1 review');
    });
  });

  describe('PUT /reviews/:id', () => {
    let savedReview;

    beforeEach(async () => {
      const res = await request(server)
        .post('/reviews')
        .set('Authorization', `Bearer ${token0}`)
        .send({ text: 'Original', rating: 3, movieId: savedMovie._id });
      savedReview = res.body;
    });

    it('should return 401 without token', async () => {
      const res = await request(server)
        .put(`/reviews/${savedReview._id}`)
        .send({ text: 'Updated', rating: 5 });
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and update review', async () => {
      const res = await request(server)
        .put(`/reviews/${savedReview._id}`)
        .set('Authorization', `Bearer ${token0}`)
        .send({ text: 'Updated', rating: 5 });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({ text: 'Updated', rating: 5 });
    });

    it('should return 404 if review belongs to different user', async () => {
      const res = await request(server)
        .put(`/reviews/${savedReview._id}`)
        .set('Authorization', `Bearer ${token1}`)
        .send({ text: 'Updated', rating: 5 });
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('DELETE /reviews/:id', () => {
    let savedReview;

    beforeEach(async () => {
      const res = await request(server)
        .post('/reviews')
        .set('Authorization', `Bearer ${token0}`)
        .send({ text: 'To delete', rating: 3, movieId: savedMovie._id });
      savedReview = res.body;
    });

    it('should return 401 without token', async () => {
      const res = await request(server)
        .delete(`/reviews/${savedReview._id}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and delete review', async () => {
      const res = await request(server)
        .delete(`/reviews/${savedReview._id}`)
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(200);
      const review = await models.Review.findById(savedReview._id);
      expect(review).toBeNull();
    });

    it('should return 404 if review belongs to different user', async () => {
      const res = await request(server)
        .delete(`/reviews/${savedReview._id}`)
        .set('Authorization', `Bearer ${token1}`);
      expect(res.statusCode).toEqual(404);
    });
  });
});