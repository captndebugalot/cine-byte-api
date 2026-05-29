import { Router } from "express";
import isAuthorized from "../middleware/isAuthorized";
import { getTopRated } from "../daos/statsDao";

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

export default router;