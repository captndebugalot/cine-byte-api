import { Router } from "express";
import auth from './auth';
import movies from './movies'
import review from "./reviews";
import stats from './stats';

const router = Router();

router.use('/auth', auth);
router.use('/movies', movies);
router.use('/reviews', review);
router.use('/stats', stats);


export default router;