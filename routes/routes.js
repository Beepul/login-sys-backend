const express = require("express");
const router = express.Router();
const {register,login,update,deleteUser, getAllUsers} = require('../controllers/Auth');
const {jwtVerify, roleAuthorization} = require('../middlewares/middlewares');


router.route('/register').post(register)
router.route('/login').post(login)
router.route('/update/:id').put(jwtVerify,roleAuthorization(['admin']),update)
router.route('/delete').delete(jwtVerify,roleAuthorization(['admin']),deleteUser)
router.route('/getAllUsers').get(jwtVerify,roleAuthorization(['user','admin']),getAllUsers)




module.exports = router;
