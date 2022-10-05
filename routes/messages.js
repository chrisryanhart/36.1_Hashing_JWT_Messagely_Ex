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



/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

 router.get('/:id',ensureLoggedIn, async (req,res,next)=>{
    try{
        const id = req.params.id;
        const username = req.user.username;
    
        const msgDetails = await Message.get(id);
    
        if (username !== msgDetails.to_user.username && username !== msgDetails.from_user.username){
            throw new ExpressError('cant read this message',401);
        }
    
        return res.json({message: msgDetails});
    
    } catch(err){
        next(err);
    }
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/',ensureLoggedIn, async (req,res,next)=>{
    try{
        const {from_username, to_username, body} = req.body;

        const newMsg = await Message.create({from_username, to_username, body});
    
        return res.json({message: newMsg});
    }catch(err){
        next(err);
    }
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read',ensureLoggedIn, async (req,res,next)=>{
    try{
        const id = req.params.id;
        const username = req.user.username;
    
        const msgDetails = await Message.get(id);
    
        if (username !== msgDetails.to_user.username){
            throw new ExpressError('cant read this message',401);
        }
    
        const readMsg = await Message.markRead(id);
    
        return res.json({message: readMsg});
    } catch(err){
        next(err);
    }
});

 module.exports = router;