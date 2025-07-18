exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'SuperAdmin')
    return res.status(403).json({ message: 'Access denied' });
  next();
};
