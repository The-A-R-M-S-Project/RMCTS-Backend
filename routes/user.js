const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users");

const authProtector = require("../auth/authProtector");
const multer = require("../middlewares/multer");
const authControllers = require("../auth/authController");

//===========================using auth controllers ========================
router.post("/", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.post("/login-face-recognition", authControllers.loginWithFace);

// ---- TODO ----
// - Change Password
// - Forgot Password
//===================================================================
router.get("/confirmation/:token", userControllers.confirmEmail);
router.post("/resend", userControllers.resendToken);
router.patch("/face-code/:id", userControllers.updateUserFaceCode);

router.use(authProtector());
router.patch("/profile/:id", userControllers.updateProfile);
router.patch("/image", userControllers.updateProfileImage);
router.get("/me", (req, res) => {
  res.send(req.user);
});
router.get("/profile/:id", userControllers.getProfile);

// ---- TODO ----
// - send email

module.exports = router;
