const User = require("../models/user");
const Role = require("../models/role");

exports.hasPermission = (action, module = 'student') => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('role');

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Allow if SuperAdmin or Admin
      const roleName = user.role?.name || (await Role.findById(user.role)?.name);
      if (['SuperAdmin', 'Admin'].includes(roleName)) {
        return next();
      }

      // Check permissions array (no need to populate)
      const hasAccess = user.permissions?.some(
        (perm) => perm.module === module && perm.action === action
      );

      if (!hasAccess) {
        return res.status(403).json({ message: 'Permission denied' });
      }

      next();
    } catch (err) {
      console.error('Permission check error:', err);
      res.status(500).json({ message: 'Server error during permission check' });
    }
  };
};
