const express = require('express');
const { userRegister, userLogin } = require('../controllers/userController');
const userRouter = express.Router();

userRouter.post('/register', userRegister);
userRouter.post('/login', userLogin);
userRouter.post('/logout', (req, res) => {
    res.status(200).json({ message: "Logged out" });
});

module.exports = userRouter;