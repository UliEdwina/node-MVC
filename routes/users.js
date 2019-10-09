const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')

let User = require('../models/User')

let authChecker = require('../utils/authChecker')

let signupController = require('../controllers/signupController') 
let userController   = require('../controllers/userController')

/* GET users listing. */
router.get('/', function(req, res, next) {
    userController.findAllUsers({}, (err, users) => {
        if (err) {
            res.status(400).json({
                confirmation: 'failure',
                message: err
            })
        } else {
            res.json({
                confirmation: 'success',
                payload: users
            })
        }
    })
});

router.get('/register', function (req, res) {
    res.render('register', { error_msg: false, success_msg: false })
})

router.post('/register', authChecker, signupController.checkExistEmail, signupController.checkExistUsername, signupController.createUser)
//route for login page get & Post respectively


router.get('/login', function (req, res) {
    res.render('login', {error_msg: false, success_msg: false})
})

router.post('/login', function (req, res) {
    //finds instance of user with email, followed by callback instructing a check for errors in login
    User.findOne({ email: req.body.email }, function (error, user) {
        if (error) res.render('login', { error_msg: true, errors: [{ message: 'Email and password does not match' }] })
        //uses bycript to compare passwords followed by callback instructing  a check for an error, else render password match message, else does not match message
        if (user) {
            bcrypt.compare(req.body.password, user.password, function (error, result) {
                if (error) {
                    res.render('login', { error_msg: true, errors: [{ message: 'Email and password does not match' }] })
                } else {
                    if (result) {
                        res.render('login', {error_msg: false, success_msg: 'You are logged in!!!'})
                    } else {
                        res.render('login', {error_msg: true, success_msg: false, errors: [{message: 'Email and password does not match' }]})
                    }
                }
            })
        }  else {
            res.render('login', { error_msg: true, errors: [{ message: 'Email and password does not match' }], success_msg: false })
        }
    })
})



router.put('/updateuserbyid/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (error, updatedUser) => {
        if (error) {
            res.status(400).json({
                confirmation: 'failure',
                message: error
            })
        } else {
            res.json({
                confirmation: 'success',
                payload: updatedUser
            })
        }
    })
})

router.delete('/deleteuserbyid/:id/', function (req, res) {
    User.findByIdAndDelete(req.params.id, function (error, deletedUser) {
        if (error) {
            res.status(400).json({
                confirmation: 'failure',
                message: error
            })
        } else {
            res.json({
                confirmation: 'success',
                payload: deletedUser
            })
        }
    })
})

// Add emailExist and usernameExist checks to createuser rout

module.exports = router;