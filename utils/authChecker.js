//FULL DISCLOSURE I did not write this code, I am showing here that I understand what it does and how it is used. 



function authChecker(req, res, next) {
    //calls functions from below and passes "request" as parameter corresponding with the parameters in the authChecker function
    firstNameChecker(req)
    lastNameChecker(req)
    userNameChecker(req)
    emailChecker(req)
    passwordChecker(req)
// returns errors with request to global function, validationErrors
    let errors = req.validationErrors()
    
//renders 'register' path if an error is returned
    if (errors) {
        res.render('register', { error_msg: true, errors: errors })
    } else {
    // if no error, contintue
        next()
    }
}

//functions that passes the "firstName, lastName, username, and email" respectively from the  classes in register.ejs form. 

function firstNameChecker(firstName) {
    //checks to mske sure 'firstName,' is not empty following with a message establishing length requirements. 
    firstName.check('firstName').notEmpty().withMessage('Please enter a first name').isLength({ min: 3, max: 15 }).withMessage('First name must be betweeen 3 and 15 characters').blacklist(/<>\//)
}

function lastNameChecker(lastName) {
    //checks to mske sure 'lastName,' is not empty following with a message establishing length requirements.
    lastName.check('lastName').notEmpty().withMessage('Please enter a last name').isLength({ min: 3, max: 15 }).withMessage('Last name must be betweeen 3 and 15 characters').blacklist(/<>\//)
}

function userNameChecker(username) {
    //checks to mske sure 'username,' is not empty following with a message establishing length requirements.
    username.check('username').notEmpty().withMessage('Please enter a username').isLength({ min: 3, max: 15 }).withMessage('Username must be betweeen 3 and 15 characters').blacklist(/<>\//)
}

function emailChecker(email) {
    //checks to mske sure 'email,' is not empty following with a message establishing length requirements.
    email.check('email').isEmail().withMessage('Please enter a valid email')
}

function passwordChecker(password) {
    //checks to mske sure 'password,' is not empty following with a message establishing length requirements.
    password.check('password').notEmpty().withMessage('Password can not be empty')

    password.checkBody('password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d`~!@#$%^&*()_+]{5,10}$/).withMessage('Minimum 5 and maximum 10 characters, at least one uppercase letter, one lowercase letter, one number and one special character')

    password.checkBody('password2').notEmpty().withMessage('Confirm password can not be empty').equals(password.body.password).withMessage('Passwords must match')
}

module.exports = authChecker