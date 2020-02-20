const express = require('express');
const router = express.Router();
const adminControllers = require('../controllers/Admin');

const auth = require('../middleware/auth');

//====================routes===========================
// HTTP POST /admins ----> Registers admin.
router.post('/', adminControllers.createNewAdmin)

// HTTP POST /admins/login ----> Allow admins to login.
router.post('/login', adminControllers.adminLogin)

// HTTP GET / admins/me ----> Gets admin profile.
router.get('/me', auth, async(req, res)=>{
    res.send(req.admin);
})
// HTTP POST /admins/logout ---->Logs out the admin
router.post('/me/logout', auth, async(req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token)=>{
            return token.token != req.token
        })
        await req.admin.save()
        res.send()
    } catch(err){
        res.status(500).send(error)
    }
})

// HTTP post /admins/logoutall ----> Logs out admin from all devices.
router.post('/me/logout-all', auth, async(req, res)=> {
    try{
        req.admin.tokens.splice(0, req.admin.tokens.length)
        await req.user.save()
        res.send()
    }catch(error){
        res.status(500).send(error)
    }
})
router.get('/', (req, res)=>{
    res.json({message: 'Hello, admin!'});
})
router.post('/add-equipment', adminControllers.addItem)
router.get('/equipment', adminControllers.getItem)

module.exports = router;