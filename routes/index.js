import { Router } from "express";
import auth from './auth';
import movies from './movies'

const router = Router();

router.use('/auth', auth);
router.use('/movies', movies);


export default router;