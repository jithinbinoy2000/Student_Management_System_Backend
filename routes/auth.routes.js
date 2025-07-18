const router = require('express').Router();
const { login, createAccount } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/register',createAccount)
module.exports = router;
