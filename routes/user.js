const express = require('express');

const  router = express.Router();

const {signup,login,logout,forgotPassword,resetPassword}  = require('../controllers/UserControllers');

router.post("/signup",signup);
router.post("/login",login);
router.get("/logout",logout);
router.post("/forgotpassword",forgotPassword);
router.post("/password/reset/:token",resetPassword);
module.exports = router;