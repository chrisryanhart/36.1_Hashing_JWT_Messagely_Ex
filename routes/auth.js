const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError.js')

// nr
const db = require('../db.js');

const bcrypt = require('bcrypt');
const {BCRYPT_WORK_FACTOR,SECRET_KEY, DB_URI} = require('../config');
const {authenticateJWT,ensureCorrectUser,ensureLoggedIn} = require('../middleware/auth.js');
const Message = require("../models/message.js");
const User = require("../models/user.js");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async function(req,res,next){
    try{
        const {username,password} = req.body;

        const results = await db.query(`
            SELECT username, password
            FROM users
            WHERE username=$1`,[username]);
        const user = results.rows[0];

        if (user){
            if (await bcrypt.compare(password,user.password)===true){
                let token = jwt.sign({username},SECRET_KEY);
                return res.json({token});
            }
        }
        throw new ExpressError('Invalid username/password',400);

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
router.post('/register', async function(req,res,next){
    try{
        const {username, password, first_name, last_name, phone} = req.body;

        const registeredUser = await User.register({username, password, first_name, last_name, phone});
        
        if(registeredUser){
            let userToken = jwt.sign({username},SECRET_KEY)
            return res.json({token: userToken});
        }

        throw new ExpressError('Invalid username/password',400);

    } catch(err){
        next(err);
    }
});


module.exports = router;