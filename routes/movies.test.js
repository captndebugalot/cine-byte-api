import request from 'supertest';
import server from '../server';
import * as testUtils from '../testUtils';
import models from '../models';

describe('/movies', () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);
  afterEach(testUtils.clearDB);

  const user0 = { email: 'user0@mail.com', password: '123password' };
  const user1 = { email: 'user1@mail.com', password: '456password' };

  const movie0 = { title: 'The Dark Side of Doggy Treats', genre: 'Horror', year: 2021, director: 'Max' };
  const movie1 = { title: 'The Bark Side of the Moon', genre: 'Drama', year: 2020, director: 'Max' };

  let token0;
  let adminToken;

  beforeEach(async () => {
    await request(server).post('/auth/signup').send(user0);
    const res0 = await request(server).post('/auth/login').send(user0);
    token0 = res0.body.token;

    await request(server).post('/auth/signup').send(user1);
    await models.User.updateOne(
      { email: user1.email },
      { $push: { roles: 'admin' } }
    );
    const res1 = await request(server).post('/auth/login').send(user1);
    adminToken = res1.body.token;
  });

  describe('GET /movies', () => {
    it('should return 401 without token', async () => {
      const res = await request(server).get('/movies');
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and empty array with no movies', async () => {
      const res = await request(server)
        .get('/movies')
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual([]);
    });

    it('should return all movies', async () => {
      await models.Movie.insertMany([movie0, movie1]);
      const res = await request(server)
        .get('/movies')
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(2);
    });
  });

  describe('GET /movies/:id', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await models.Movie.create(movie0);
    });

    it('should return 401 without token', async () => {
      const res = await request(server).get(`/movies/${savedMovie._id}`);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 200 and movie by id', async () => {
      const res = await request(server)
        .get(`/movies/${savedMovie._id}`)
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject({ title: movie0.title });
    });

    it('should return 404 for non existent movie', async () => {
      const res = await request(server)
        .get('/movies/6a14d10f77de9e0b3832050a')
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST /movies', () => {
    it('should return 401 without token', async () => {
      const res = await request(server).post('/movies').send(movie0);
      expect(res.statusCode).toEqual(401);
    });

    it('should return 403 for normal user', async () => {
      const res = await request(server)
        .post('/movies')
        .set('Authorization', `Bearer ${token0}`)
        .send(movie0);
      expect(res.statusCode).toEqual(403);
    });

    it('should return 200 and create movie for admin', async () => {
      const res = await request(server)
        .post('/movies')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(movie0);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toMatchObject(movie0);
    });
  });

  describe('PUT /movies/:id', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await models.Movie.create(movie0);
    });

    it('should return 403 for normal user', async () => {
      const res = await request(server)
        .put(`/movies/${savedMovie._id}`)
        .set('Authorization', `Bearer ${token0}`)
        .send({ title: 'Updated Title' });
      expect(res.statusCode).toEqual(403);
    });

    it('should return 200 and update movie for admin', async () => {
      const res = await request(server)
        .put(`/movies/${savedMovie._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Updated Title' });
      expect(res.statusCode).toEqual(200);
    });
  });

  describe('DELETE /movies/:id', () => {
    let savedMovie;

    beforeEach(async () => {
      savedMovie = await models.Movie.create(movie0);
    });

    it('should return 403 for normal user', async () => {
      const res = await request(server)
        .delete(`/movies/${savedMovie._id}`)
        .set('Authorization', `Bearer ${token0}`);
      expect(res.statusCode).toEqual(403);
    });

    it('should return 200 and delete movie for admin', async () => {
      const res = await request(server)
        .delete(`/movies/${savedMovie._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      const movie = await models.Movie.findById(savedMovie._id);
      expect(movie).toBeNull();
    });
  });
});