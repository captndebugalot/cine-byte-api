import { Router } from "express";
import isAuthorized from "../middleware/isAuthorized";
import { getTopRated, getByGenre, getMostReviewed } from "../daos/statsDao";

const router = Router();
router.use(isAuthorized);

// get top rated movies by average rating
router.get('/top-rated', async (req, res) => {
    try {
        const topRated = await getTopRated();
        return res.json(topRated);
    } catch (e) {
        console.log(`getTopRated error: ${e.message}`);
        return res.status(500).send('Server error');
    }
});


// get by genre movies by average rating
router.get('/by-genre', async (req, res) => {
    try {
        const byGenre = await getByGenre();
        return res.json(byGenre);
    } catch (e) {
        console.log(`getByGenre error: ${e.message}`);
        return res.status(500).send('Server error');
    }
});


// get most reviewed movies
router.get('/most-reviewed', async (req, res) => {
    try {
        const mostReviewed = await getMostReviewed();
        return res.json(mostReviewed);
    } catch (e) {
        console.log(`getMostReviewed error: ${e.message}`);
        return res.status(500).send('Server error');
    }
});


export default router;