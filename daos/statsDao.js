import models from '../models'

export const getTopRated = async () => {
    return await models.Review.aggregate([
        // group review by movieId and calculate average ratings
        {
            $group: {
                _id: '$movieId',
                averageRating: {$avg: '$rating'},
                reviewCount: {$sum: 1 },
            },
        },
        // sort by highest average rating first
        {$sort: {averageRating: -1}},
        // only return top 10
        {$limit: 10},
        // join with movies collection to get movie details
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: '_id',
                as: 'movieArray',
            },
        },
        // extract movie from array
        {
            $addFields: {
                movie: {$arrayElemAt:['$movieArray', 0]},
            },
        },
        // remove movieArray
        {$project: {movieArray: 0}},
    ]);
};