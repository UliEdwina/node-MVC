const User = require('../models/User')
const bcrypt = require('bcryptjs')

module.exports = {
    checkExistEmail: (req, res, next) => {
        //creates one instance of user. sends condition of error with code 400 and confirm failure
        User.findOne({ email: req.body.email }, function (error, user) {
            if (error) {
                res.status(409).json({
                    confirmation: 'failure',
                    message: error
                })
            }

            if (user) {
                res.render('register', {error_msg: true, errors: [{ message: 'Email already taken :(' }]})
            } else {
                next()

                return
            }
        })
    },
    checkExistUsername: (req, res, next) => {
        User.findOne({ username: req.body.username }, function (error, user) {
            if (error) {
                res.status(400).json({
                    confirmation: 'failure',
                    message: error
                })
            }

            if (user) {
                res.render('register', {error_msg: true, errors: [{ message: 'Username already taken :(' }]})
            } else {
                next()

                return
            }
        })
    },
    createUser: (req, res) => {
        bcrypt.genSalt(10, function (error, salt) {
            if (error) {
                res.status(400).json({
                    confirmation: 'failure',
                    message: error
                })
            }

            console.log(salt)

            bcrypt.hash(req.body.password, salt, function (error, hash) {
                if (error) {
                    res.status(400).json({
                        confirmation: 'failure',
                        message: error
                    })
                } else {
                    let newUser = new User({
                        first_name: req.body.firstName,
                        last_name: req.body.lastName,
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    })

                    newUser.save(function (error, user) {
                        if (error) {
                            res.status(400).json({
                                confirmation: 'failure',
                                message: error
                            })
                        } else {
                            res.json({
                                confirmation: 'success',
                                payload: user
                            })
                        }
                    })
                }
            })
        })
    }
}