import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import isAuthorized from '../middleware/isAuthorized';
import { createUser, getUser, updatePassword } from '../daos/userDao';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// attempts to create a user with hashed password and defautl 'user' role
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password) return res.sendStatus(400);

    // passes email and password to userDao to create a user
    // returns the created user object if successful, null if not
    const user = await createUser({ email, password });
    if (user) return res.sendStatus(200);
  } catch (error) {
    console.error('Signup error:', error.name, error.message);
    if (error.name === 'MongoServerError' && error.message.includes('E11000')) {
      return res.sendStatus(409);
    }
    return res.status(500).send('Server error');
  }
});

// login flow look up user in db and compare password to produce a token
router.post(
  '/login',
  (req, res, next) => {
    // eslint-disable-next-line no-console
    console.log(`Audit Log For Login User: ${req.body.email}`);
    next();
  },
  async (req, res) => {
    const { email, password } = req.body;
    if (!password) return res.sendStatus(400);

    try {
      //look up user by email through daos
      const user = await getUser(email);
      // if no user return 401 unathorized
      if (!user) return res.sendStatus(401);
      const hashedPassword = user.password;
      // compare provided password against the hash password
      const isAuthenticated = await bcrypt.compare(password, hashedPassword);
      if (isAuthenticated) {
        const token = jwt.sign(
          { _id: user._id.toString(), email: user.email, roles: user.roles },
          JWT_SECRET,
          { expiresIn: '7d' },
        );
        return res.status(200).json({ token });
      }
      return res.status(401).send('unathorized');
    } catch (e) {
      return res.status(500).send('Server error');
    }
  },
);

// lets a logged in user change their password
router.put('/password', isAuthorized, async (req, res) => {
  const { password } = req.body;
  if (!password) return res.sendStatus(400);

  try {
    await updatePassword(req.user._id, password);
    return res.sendStatus(200);
  } catch (e) {
    return res.status(500).send('Server error');
  }
});

export default router;
