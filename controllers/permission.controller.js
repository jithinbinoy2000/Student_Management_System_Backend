const permissions = require("../models/permissions");


exports.assignPermission = async (req, res) => {
  const { userId, module, action } = req.body;
  const perm = new permissions({ grantedTo: userId, module, action });
  await perm.save();
  res.status(201).json(perm);
};

exports.getPermissionsByUser = async (req, res) => {
  const { userId } = req.params;
  const permissions = await permissions.find({ grantedTo: userId });
  res.json(permissions);
};
