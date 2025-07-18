const Student = require('../models/student');
const Permission = require('../models/permissions');
const Role = require('../models/role');
const User = require('../models/user');

// Utility: Check if user has permission for a student module action
// const hasPermission = async (userId, action) => {
//   console.log(userId,action)
//   const permission = await Permission.findOne({
//     grantedTo: userId,
//     module: 'student',
//     action,
//   });
//   return !!permission;
// };

// const hasPermission = async (userId, action) => {
//   const user = await User.findById(userId); // No need to populate anything
//   if (!user || !user.permissions) return false;

//   return user.permissions.some(
//     (perm) => perm.module === 'student' && perm.action === action
//   );
// };

const hasPermission = async (userId, action, module = 'student') => {
  const user = await User.findById(userId).populate('role');
  if (!user) return false;

  const roleName = await getRoleName(user.role);
  if (['SuperAdmin'].includes(roleName)) {
    return true; // Admins bypass manual permission checks
  }

  return user.permissions?.some(
    (perm) => perm.module === module && perm.action === action
  ) || false;
};


// Utility: Get role name safely regardless of input type
const getRoleName = async (roleField) => {
  if (!roleField) return null;
  if (typeof roleField === 'string') {
    const role = await Role.findById(roleField);
    return role?.name || null;
  }
  if (typeof roleField === 'object' && roleField.name) return roleField.name;
  const role = await Role.findById(roleField);
  return role?.name || null;
};

// CREATE STUDENT
// exports.createStudent = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('role');
//     const roleName = await getRoleName(user.role);
//     if (!roleName) return res.status(403).json({ message: 'Invalid role' });

//     const { assignedTo, rollNumber, ...studentData } = req.body;

//     // Check for duplicate rollNumber
//     if (rollNumber) {
//       const exists = await Student.findOne({ rollNumber });
//       if (exists) {
//         return res.status(400).json({ message: 'Roll number already exists' });
//       }
//     }

//     const newRoll = rollNumber || `STU${Date.now().toString().slice(-6)}`;
//     let assignToUserId;

//     if (roleName === 'SuperAdmin') {
//       if (assignedTo) {
//         const assignedUser = await User.findById(assignedTo);
//         if (!assignedUser) {
//           return res.status(400).json({ message: 'Assigned user not found' });
//         }
//         assignToUserId = assignedTo;
//       } else {
//         assignToUserId = user._id;
//       }
//     } else {
//       const canCreate = await hasPermission(user._id, 'create');
//       if (!canCreate) {
//         return res.status(403).json({ message: 'Permission denied to create student' });
//       }
//       assignToUserId = user._id;
//     }

//     const student = new Student({
//       ...studentData,
//       rollNumber: newRoll,
//       assignedTo: assignToUserId,
//     });

//     await student.save();
//     return res.status(201).json(student);
//   } catch (err) {
//     console.error('Error creating student:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

exports.createStudent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    const roleName = await getRoleName(user.role);
    if (!roleName) return res.status(403).json({ message: 'Invalid role' });

    const { assignedTo, rollNumber, ...studentData } = req.body;

    // Check for duplicate rollNumber
    if (rollNumber) {
      const exists = await Student.findOne({ rollNumber });
      if (exists) {
        return res.status(400).json({ message: 'Roll number already exists' });
      }
    }

    const newRoll = rollNumber || `STU${Date.now().toString().slice(-6)}`;

    // Allow if SuperAdmin or Admin
    if (['SuperAdmin', 'Admin'].includes(roleName)) {
      let assignToUserId = user._id;

      // Allow SuperAdmin/Admin to assign to other users
      if (assignedTo) {
        const assignedUser = await User.findById(assignedTo);
        if (!assignedUser) {
          return res.status(400).json({ message: 'Assigned user not found' });
        }
        assignToUserId = assignedTo;
      }

      const student = new Student({
        ...studentData,
        rollNumber: newRoll,
        assignedTo: assignToUserId,
      });

      await student.save();
      return res.status(201).json(student);
    }

    // For regular users: check permission and force assignedTo = self
    const canCreate = await hasPermission(user._id, 'create', 'student');
    if (!canCreate) {
      return res.status(403).json({ message: 'Permission denied to create student' });
    }

    const student = new Student({
      ...studentData,
      rollNumber: newRoll,
      assignedTo: user._id,
    });

    await student.save();
    return res.status(201).json(student);

  } catch (err) {
    console.error('Error creating student:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET ALL STUDENTS
// exports.getAllStudents = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.user.id).populate('role');
//     const roleName = await getRoleName(user.role);
//     if (!roleName) return res.status(403).json({ message: 'Role not found' });

//     let students;
//     if (roleName === 'SuperAdmin') {
//       students = await Student.find().populate('assignedTo', 'username email');
//     } else {
//       const canView = await hasPermission(user._id, 'view');
//       console.log(canView)
//       if (!canView) {
//         return res.status(403).json({ message: 'Permission denied to view students' });
//       }
//       students = await Student.find().populate('assignedTo', 'username');
//     }

//     res.json(students);
//   } catch (err) {
//     console.error('Error fetching students:', err);
//     next(err);
//   }
// };

exports.getAllStudents = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    const roleName = await getRoleName(user.role);
    if (!roleName) return res.status(403).json({ message: 'Role not found' });

    // SuperAdmin or Admin can see all students by default
    if (['SuperAdmin', 'Admin'].includes(roleName)) {
      const students = await Student.find().populate('assignedTo', 'username email');
      return res.json(students);
    }

    // Other users: check if they have 'view' permission
    const canView = await hasPermission(user._id, 'view');
    if (!canView) {
      return res.status(403).json({ message: 'Permission denied to view students' });
    }

    // Return all students (no assignedTo filtering)
    const students = await Student.find().populate('assignedTo', 'username');
    res.json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    next(err);
  }
};

// UPDATE STUDENT
exports.updateStudent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const roleName = await getRoleName(user.role);
    if (!roleName) return res.status(403).json({ message: 'Role not found' });

    if (roleName !== 'SuperAdmin') {
      const canEdit = await hasPermission(user._id, 'edit');
      if (!canEdit || !student.assignedTo.equals(user._id)) {
        return res.status(403).json({ message: 'Permission denied to edit this student' });
      }
    }

    const updated = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//  DELETE STUDENT
exports.deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    const { id } = req.params;

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const roleName = await getRoleName(user.role);
    if (!roleName) return res.status(403).json({ message: 'Role not found' });

    if (roleName !== 'SuperAdmin') {
      const canDelete = await hasPermission(user._id, 'delete');
      if (!canDelete || !student.assignedTo.equals(user._id)) {
        return res.status(403).json({ message: 'Permission denied to delete this student' });
      }
    }

    await Student.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
