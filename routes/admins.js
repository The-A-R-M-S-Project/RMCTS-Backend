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
router.post('/me/logout', auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.admin.save()
        res.send()
    } catch (err) {
        res.status(500).send(error)
    }
})

// HTTP post /admins/logoutall ----> Logs out admin from all devices.
router.post('/me/logout-all', auth, async (req, res) => {
    try {
        req.admin.tokens.splice(0, req.admin.tokens.length)
        await req.admin.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/', (req, res) => {
    res.json({ message: 'Hello, admin!' });
})

module.exports = router;