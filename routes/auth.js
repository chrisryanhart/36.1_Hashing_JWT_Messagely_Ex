const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError.js')

// nr
// const db = require('../db.js');

const {BCRYPT_WORK_FACTOR,SECRET_KEY} = require('../config');

const {authenticateJWT,ensureCorrectUser,ensureLoggedIn} = require('../middleware/auth.js');

const Message = require("../models/message.js");
const User = require("../models/user.js");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', function(req,res,next){
    try{
        // take username and pw attempt
        // call auth middleware
        // return token with username


    }catch(err){
        next(err);
    }

});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
 router.post('/register', function(req,res,next){

});