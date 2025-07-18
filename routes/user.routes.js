const router = require('express').Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { isSuperAdmin } = require('../middlewares/role.middleware');
const ctrl = require('../controllers/user.controller');

router.use(verifyToken, isSuperAdmin);

router.post('/', ctrl.createStaff);
router.get('/', ctrl.getAllStaff);
router.put('/:id', ctrl.updateStaff);
router.delete('/:id', ctrl.deleteStaff);

module.exports = router;
