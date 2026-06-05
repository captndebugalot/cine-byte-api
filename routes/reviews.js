import { Router } from 'express';
import { create, getByUser, updateById, deleteById } from '../daos/reviewDao';
import isAuthorized from '../middleware/isAuthorized';

const router = Router();

// all routes require authentication
router.use(isAuthorized);

// get all reviews for logged in user
router.get('/', async (req, res) => {
  try {
    const reviews = await getByUser(req.user._id);
    return res.json(reviews);
  } catch (_e) {
    console.log(`gat all reviews error: ${_e.message}`);
    return res.status(500).send('Server error');
  }
});

// create a new review
router.post('/', async (req, res) => {
  try {
    const review = await create(req.user._id, req.body);
    return res.json(review);
  } catch (_e) {
    console.log(`create review error: ${_e.message}`);
    return res.status(500).send(`Server error`);
  }
});

// update own review
router.put('/:id', async (req, res) => {
  try {
    const review = await updateById(req.user._id, req.params.id, req.body);
    if (!review) return res.sendStatus(404);
    return res.json(review);
  } catch (_e) {
    console.log(`update review error: ${_e.message}`);
    return res.status(400).send('Server error');
  }
});

// delete own review
router.delete('/:id', async (req, res) => {
  try {
    const review = await deleteById(req.user._id, req.params.id);
    if (!review) return res.sendStatus(404);
    return res.sendStatus(200);
  } catch (_e) {
    console.log(`delete review error: ${_e.message}`);
    return res.status(400).send('Server error');
  }
});

export default router;
