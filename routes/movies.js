import express from 'express';
import isAuthorized from '../middleware/isAuthorized';
import {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
} from '../daos/movieDao';
import isAdmin from '../middleware/isAdmin';
import { getByMovie } from '../daos/reviewDao';

const router = express.Router();

// all routes require authentication
router.use(isAuthorized);

// get all movies in db
router.get('/', async (req, res) => {
  try {
    const movies = await getAll();

    return res.json(movies);
  } catch (_e) {
    console.log(`get all movies route error: ${_e.message}`);
    return res.status(500).send('Server error');
  }
});

// find movie by id and also queries its reviews
router.get('/:id', async (req, res) => {
  try {
    const movie = await getById(req.params.id);
    if (!movie) return res.sendStatus(404);
    // retrieving movie reviews
    const reviews = await getByMovie(req.params.id);
    return res.json({ ...movie, reviews });
  } catch (_e) {
    console.log(`get getById route error: ${_e.message}`);
    return res.status(400).send('Server error');
  }
});

// create a movie and return it
router.post('/', isAdmin, async (req, res) => {
  try {
    const movie = await create(req.body);
    return res.json(movie);
  } catch (_e) {
    console.log(`create route error: ${_e.message}`);
    return res.status(500).send('Server error');
  }
});

// update existing movie by id and returns updated movie
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const movie = await updateById(req.params.id, req.body);
    if (!movie) return res.sendStatus(404);
    return res.json(movie);
  } catch (_e) {
    console.log(`updateById route error: ${_e.message}`);
    return res.status(500).send('Server error');
  }
});

// delete a movie by id
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const movie = await deleteById(req.params.id);
    if (!movie) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (_e) {
    console.log(`delete route error: ${_e.message}`);
    return res.status(400).send('Server error');
  }
});

export default router;
