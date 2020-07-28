const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/Admins');

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer')

//====================routes===========================

router.post('/', multer.multerUploads, adminControllers.createNewAdmin)

router.post('/login', adminControllers.adminLogin)

router.get('/me', auth, async (req, res) => {
    res.send(req.admin);
})
router.post('/me/logout', auth, adminControllers.logout)

router.post('/confirmation', adminControllers.confirmEmail)

// HTTP post /admins/logoutall ----> Logs out admin from all devices.
router.post('/me/logout-all', auth, adminControllers.logoutAll)


module.exports = router;