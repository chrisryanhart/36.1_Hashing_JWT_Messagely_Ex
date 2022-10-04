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

router.get('/',async (req,res,next) => {

    const allUsers = await User.all();

    return res.json({users: allUsers});


});



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', async (req,res,next)=>{

    const username = req.params.username;

    const userDetails = await User.get(username);

    return res.json({user: userDetails});

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
router.get('/:username/to', async (req,res,next)=>{

    const username = req.params.username;

    const receivedMessages = await User.messagesTo(username);


    return res.json({messages: receivedMessages});

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
 router.get('/:username/from', async (req,res,next)=>{

    const username = req.params.username;

    const sentMessages = await User.messagesFrom(username);

    return res.json({messages: sentMessages});

});



 module.exports = router;