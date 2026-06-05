const isAdmin = async (req, res, next) => {
  if (req.user && req.user.roles && req.user.roles.includes('admin')) {
    return next();
  }
  return res.sendStatus(403);
};

export default isAdmin;
