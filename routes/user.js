const express = require('express');

const  router = express.Router();
const {isUserLoggedIn, customeRole} = require("../middlewares/user")
const {signup,login,logout,forgotPassword,
    resetPassword,getLoggedInUserDetail,changePassword,
    updateUserDetails,getAllUserForAdmin,getAllUserForManager,
    getOneUserForAdmin,adminUpdateUserDetail,adminDeleteUser
}  = require('../controllers/UserControllers');

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/forgotpassword").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/userdashboard").get(isUserLoggedIn,getLoggedInUserDetail)
router.route("/password/update").post(isUserLoggedIn,changePassword);
// /userdashboard/update change this route post to patch for info look into the controller comment.
router.route("/userdashboard/update").post(isUserLoggedIn,updateUserDetails);

//admin routes
router.route("/admin/users").get(isUserLoggedIn,customeRole("admin"),getAllUserForAdmin)
router.route("/admin/user/:id")
.get(isUserLoggedIn,customeRole("admin"),getOneUserForAdmin)
.put(isUserLoggedIn,customeRole("admin"),adminUpdateUserDetail)
router.route("/admin/user/delete/:id").delete(isUserLoggedIn,customeRole("admin"),adminDeleteUser)
//manager routes
router.route("/admin/manager/users").get(isUserLoggedIn,customeRole("manager"),getAllUserForManager)
module.exports = router;