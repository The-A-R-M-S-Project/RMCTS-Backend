const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/Admins");

const authProtector = require("../auth/authProtector");
const multer = require("../middlewares/multer");

router.use(authProtector());

//====================routes===========================

router.post("/", multer.multerUploads, adminControllers.createNewAdmin);

router.post("/login", adminControllers.adminLogin);

router.get("/me", async (req, res) => {
  res.send(req.admin);
});
router.post("/me/logout", adminControllers.logout);

router.get("/confirmation/:token", adminControllers.confirmEmail);
router.post("/resend", adminControllers.resendToken);

// HTTP post /admins/logoutall ----> Logs out admin from all devices.
router.post("/me/logout-all", adminControllers.logoutAll);

module.exports = router;
