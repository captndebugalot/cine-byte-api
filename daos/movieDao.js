import models from '../models';

export const getAll = async () => {
  return await models.Movie.find().lean();
};

export const create = async (movieObj) => {
  return await models.Movie.create(movieObj);
};

export const getById = async (id) => {
  return await models.Movie.findById(id).lean();
};

// updates movie by id and returns it the movie updated
export const updateById = async (id, movieObj) => {
  return await models.Movie.findByIdAndUpdate(id, movieObj, {
    new: true,
  }).lean();
};

export const deleteById = async (id) => {
  return await models.Movie.findByIdAndDelete(id).lean();
};
