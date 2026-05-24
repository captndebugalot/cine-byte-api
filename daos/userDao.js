import bcrypt from 'bcrypt'
import models from '../models'

const SALT_ROUNDS = 10;

// Creates a new user in the database
export const createUser = async (userObj) => {
    const hashedPassword = await bcrypt.hash(userObj.password, SALT_ROUNDS);
    return models.User.create({...userObj, password: hashedPassword});
};