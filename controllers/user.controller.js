const Role = require('../models/role');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const Permission = require('../models/permissions');


// // CREATE STAFF
// exports.createStaff = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     //  Check if user already exists (by username or email)
//     const existingUser = await User.findOne({
//       $or: [{ email }, { username }]
//     });

//     if (existingUser) {
//       return res.status(400).json({
//         message: 'User with this email or username already exists'
//       });
//     }

//     // Find the 'Staff' role
//     const role = await Role.findOne({ name: 'Staff' });
//     if (!role) {
//       return res.status(400).json({ message: "Role 'Staff' not found" });
//     }

//     //  Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create and save the user
//     const user = new User({
//       username,
//       email,
//       password: hashedPassword,
//       role: role._id
//     });

//     await user.save();

//     // Assign default permissions for the 'student' module
//     const defaultPermissions = ['create', 'view'].map(action => ({
//       module: 'student',
//       action,
//       grantedTo: user._id
//     }));

//     await Permission.insertMany(defaultPermissions);

//     //  Populate role in response (optional)
//     await user.populate('role');

//     //  Return response
//     res.status(201).json({
//       message: 'Staff created and permissions assigned successfully',
//       user,
//       permissions: defaultPermissions
//     });

//   } catch (error) {
//     console.error('Error creating staff:', error);

//     // Handle duplicate key error from MongoDB
//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: 'Duplicate field value: email or username already exists'
//       });
//     }

//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// CREATE STAFF
exports.createStaff = async (req, res) => {
  try {
    const { username, email, password, permissions = [] } = req.body;

    //  Check if user already exists (by username or email)
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email or username already exists'
      });
    }

    // Find the 'Staff' role
    const role = await Role.findOne({ name: 'Staff' });
    if (!role) {
      return res.status(400).json({ message: "Role 'Staff' not found" });
    }

    //  Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role._id
    });

    await user.save();

    // Assign permissions from frontend, if provided. Otherwise, use default.
    let userPermissions = [];

    if (permissions.length > 0) {
      // Use permissions sent from frontend
      userPermissions = permissions.map((perm) => ({
        module: perm.module,
        action: perm.action,
        grantedTo: user._id
      }));
    } else {
      // Assign default permissions for the 'student' module
      const defaultPermissions = ['create', 'view'].map(action => ({
        module: 'student',
        action,
        grantedTo: user._id
      }));
      userPermissions = defaultPermissions;
    }

    await Permission.insertMany(userPermissions);

    //  Populate role in response (optional)
    await user.populate('role');

    //  Return response
    res.status(201).json({
      message: 'Staff created and permissions assigned successfully',
      user,
      permissions: userPermissions
    });

  } catch (error) {
    console.error('Error creating staff:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: 'Duplicate field value: email or username already exists'
      });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET ALL STAFF
exports.getAllStaff = async (req, res) => {
  try {
    console.log("Received API call to get all staff details");

    //  Find the role document for 'Staff'
    const staffRole = await Role.findOne({ name: 'Staff' });
    if (!staffRole) {
      return res.status(404).json({ message: "Role 'Staff' not found" });
    }

    //  Query users that have this role ID
    const staff = await User.find({ role: staffRole._id }).populate('role');
    
    console.log(staff);
    res.status(200).json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UPDATE STAFF
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).populate('role');
    if (!updated) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(200).json({
      message: 'Staff updated successfully',
      user: updated
    });
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// DELETE STAFF

exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
