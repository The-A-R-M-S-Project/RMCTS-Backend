const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users");

const authProtector = require("../auth/authProtector");
const multer = require("../middlewares/multer");
const authControllers = require("../auth/authController");


//====================routes===========================

// router.post("/", multer.multerUploads, userControllers.createNewuser);
//===========================using auth controllers ========================
router.post("/", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);

// ---- TODO ----
// - Change Password
// - Forgot Password
//===================================================================
router.get("/confirmation/:token", userControllers.confirmEmail);
router.post("/resend", userControllers.resendToken);

// ---- TODO ----
router.use(authProtector())
router.patch("/profile/:id", userControllers.updateProfile)
router.patch("/profile-image", userControllers.updateProfileImage)
router.get("/me", (req, res) => {
  res.send(req.user);
});
// - get profile
router.get("/profile/:id", userControllers.getProfile)
// - send email


module.exports = router;
