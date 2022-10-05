const jwt = require('jsonwebtoken');
const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError.js')

const bcrypt = require('bcrypt');

// nr
// const db = require('../db.js');

const {BCRYPT_WORK_FACTOR,SECRET_KEY} = require('../config');

const {authenticateJWT,ensureCorrectUser,ensureLoggedIn} = require('../middleware/auth.js');

const Message = require("../models/message.js");
const User = require("../models/user.js");
const { all } = require('../models/user.js');


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/',ensureLoggedIn,async (req,res,next) => {
    try{
        const allUsers = await User.all();

        return res.json({users: allUsers});
    } catch(err){
        next(err);
    }


});



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username',ensureCorrectUser, async (req,res,next)=>{

    const username = req.params.username;
    try{
        const userDetails = await User.get(username);

        return res.json({user: userDetails});
    } catch(err){
        next(err);
    }
});



/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to',ensureCorrectUser, async (req,res,next)=>{

    try{
        const username = req.params.username;

        const receivedMessages = await User.messagesTo(username);
        return res.json({messages: receivedMessages});

    }catch(err){
        next(err);
    }

});



/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
 router.get('/:username/from',ensureCorrectUser, async (req,res,next)=>{
    try{
        const username = req.params.username;

        const sentMessages = await User.messagesFrom(username);
    
        return res.json({messages: sentMessages});
    } catch(err){
        next(err);
    }
});



 module.exports = router;