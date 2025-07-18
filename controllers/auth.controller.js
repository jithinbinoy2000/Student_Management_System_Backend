const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Role = require('../models/role');

// LOGIN
exports.login = async (req, res) => {
   console.log("Received API call to login");
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('role');
    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role.name,
        permissions:user.permissions
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

//CREATE ACCOUNT
exports.createAccount = async (req, res) => {
   console.log("Received API call to create use acc");
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User with this email already exists' });

    // Find the role document
    const selectedRole = await Role.findOne({ name: role || 'Staff' });
    if (!selectedRole)
      return res.status(400).json({ message: `Role ${role || 'Staff'} does not exist` });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: selectedRole._id
    });

    await newUser.save();

    // Generate token
    const token = jwt.sign(
      { id: newUser._id, role: selectedRole.name },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: selectedRole.name,
      },
      token
    });

  } catch (err) {
    console.error('Error in createAccount:', err);
    res.status(500).json({ message: 'Server error during account creation' });
  }
};
