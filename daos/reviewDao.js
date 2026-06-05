import models from '../models';

// create a new review
export const create = async (userId, reviewObj) =>
  models.Review.create({ ...reviewObj, userId });

// gets a review by its id and userId
export const getByUser = async (userId) =>
  models.Review.find({ userId }).lean();

// get reviews by a movie
export const getByMovie = async (movieId) =>
  models.Review.find({ movieId }).lean();

// update a review by id if it belongs to the user
export const updateById = async (userId, id, reviewObj) =>
  models.Review.findOneAndUpdate({ _id: id, userId }, reviewObj, {
    new: true,
  }).lean();

// delete a review by id if it belongs to the user
export const deleteById = async (userId, id) =>
  models.Review.findOneAndDelete({ _id: id, userId }).lean();
