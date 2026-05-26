import { Router } from "express";
import auth from './auth';
import movies from './movies'
import review from "./reviews";

const router = Router();

router.use('/auth', auth);
router.use('/movies', movies);
router.use('/reviews', review);


export default router;