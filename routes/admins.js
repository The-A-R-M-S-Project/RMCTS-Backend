const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/Admins');

const auth = require('../auth/authController');
const multer = require('../middlewares/multer')

//====================routes===========================

router.post('/', multer.multerUploads, adminControllers.createNewAdmin)

router.post('/login', adminControllers.adminLogin)

router.get('/me', auth, async (req, res) => {
    res.send(req.admin);
})
router.post('/me/logout', auth, adminControllers.logout)

router.get('/confirmation/:token', adminControllers.confirmEmail)
router.post('/resend', adminControllers.resendToken)

// HTTP post /admins/logoutall ----> Logs out admin from all devices.
router.post('/me/logout-all', auth, adminControllers.logoutAll)


module.exports = router;