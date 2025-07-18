const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { isSuperAdmin } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/permission.controller');

router.use(verifyToken, isSuperAdmin);

router.post('/', ctrl.assignPermission);
router.get('/:userId', ctrl.getPermissionsByUser);

module.exports = router;
