const express = require('express');

const  router = express.Router();
const {isUserLoggedIn} = require("../middlewares/user")
const {signup,login,logout,forgotPassword,resetPassword,getLoggedInUserDetail}  = require('../controllers/UserControllers');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isUserLoggedIn,getLoggedInUserDetail)
module.exports = router;