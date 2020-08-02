const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/Users");

const multer = require("../middlewares/multer");
const authControllers = require("../auth/authController");


//====================routes===========================

// router.post("/", multer.multerUploads, userControllers.createNewuser);
//===========================using auth controllers ========================
router.post("/", authControllers.signup);
router.post("/login", authControllers.login);
router.post("/logout", authControllers.logout);
router.get("/me", (req, res) => {
  res.send(req.user);
});

//===================================================================
router.get("/confirmation/:token", userControllers.confirmEmail);
router.post("/resend", userControllers.resendToken);

module.exports = router;
