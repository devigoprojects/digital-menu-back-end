const { createAccount, login, currentUser, deleteAccount, allUsers, update, forgotPassword,forgotPasswordPage, resetPassword } = require('../controllers/user_controller');
const validateToken = require('../middlewares/validate_token');

const express = require('express');
const router = express.Router();

router.post('/createAccount',createAccount);
router.post('/login',login);
router.get('/currentUser',validateToken,currentUser);
router.get('/delete/:id',validateToken,deleteAccount);
router.get('/allUsers',validateToken,allUsers);
router.post('/update/:id',update);
router.get('/forgot-password',forgotPassword);
router.post('/forgot-password',forgotPassword);
router.get('/reset-password/:id/:token',resetPassword);
router.post('/reset-password/:id/:token',resetPassword);

module.exports = router;