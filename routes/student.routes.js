const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { hasPermission } = require('../middlewares/permission.middleware');
const ctrl = require('../controllers/student.controller');

router.use(verifyToken);

router.post('/', hasPermission('create'), ctrl.createStudent);
router.get('/', hasPermission('view'), ctrl.getAllStudents);
router.put('/:id', hasPermission('edit'), ctrl.updateStudent);
router.delete('/:id', hasPermission('delete'), ctrl.deleteStudent);

module.exports = router;
