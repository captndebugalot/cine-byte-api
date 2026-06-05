import bcrypt from 'bcrypt';
import models from '../models';

const SALT_ROUNDS = 10;
// Admin user is created manually in database
// Creates a new user in the database
export const createUser = async (userObj) => {
  const hashedPassword = await bcrypt.hash(userObj.password, SALT_ROUNDS);
  return models.User.create({
    ...userObj,
    password: hashedPassword,
    roles: ['user'],
  });
};

// looks up user by email
export const getUser = async (email) => {
  return await models.User.findOne({ email }).lean();
};

// updates users password
export const updatePassword = async (userID, password) => {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return await models.User.findByIdAndUpdate(userID, {
    password: hashedPassword,
  });
};
