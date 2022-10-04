/** User class for message.ly */
const bcrypt = require('bcrypt');
const { DB_URI, BCRYPT_WORK_FACTOR } = require("../config");
const db = require('../db.js');
const ExpressError = require("../expressError");


/** User of the site. */

const test = 'can you access inside function';


class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    // could nest within try/catch
    const hashedPassword = await bcrypt.hash(password,BCRYPT_WORK_FACTOR);

    const results = await db.query(`INSERT INTO users (username,password,first_name,last_name,phone,join_at,last_login_at)
                VALUES ($1,$2,$3,$4,$5,current_timestamp,current_timestamp)
                  RETURNING username,password,first_name,last_name`,
                  [username,hashedPassword,first_name,last_name,phone]);
    
    return results.rows[0];
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) { 
    // check if stored password is in the database

    // add signature
    try {
      const results = await db.query(`
            SELECT username, password
            FROM users
            WHERE username=$1`, [username]);

      const user = results.rows[0]

      if(results.rows.length === 0){
        return new ExpressError('Username not found!',401);
      }

      if (user){
        if (await bcrypt.compare(password,user.password)){
          return true;
        }
      }
    } catch (err) {
      next(err);
    }
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    try {
      const results = await db.query(`UPDATE users 
      SET last_login_at=current_timestamp
      WHERE username=$1
      RETURNING username, last_login_at`,[username]);
      
      if(results.rows.length === 0){
        return new ExpressError('Username not found!',401);
      }

      return results.rows[0];

    } catch(err){
      next(err);
    }


  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 

    // try to retrieve information from global variable

    const results = await db.query(`
            SELECT username,first_name,last_name,phone
            FROM users`);

    return results.rows;

  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    try {
      const results = await db.query(`
      SELECT username,first_name,last_name,phone,join_at,last_login_at
      FROM users
      WHERE username=$1`,[username]);

      if(results.rows.length === 0){
          return new ExpressError('Username not found!',401);
      }

      return results.rows[0];
    } catch(err){
      next(err);
    }

  }


  /** Return messages from this user. (sent messages)
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 
    try{

      const results = await db.query(`
      SELECT m.id, 
        m.to_username, 
        m.body, 
        m.sent_at, 
        m.read_at,
        u.first_name,
        u.last_name,
        u.phone
      FROM messages AS m
        RIGHT JOIN 
          users AS u
        ON m.to_username = u.username
      WHERE m.from_username=$1`,[username]);

      if(results.rows.length === 0){
        return new ExpressError('Username not found!',401);
      }

      const messagesFrom = results.rows.map(r => ({
        "id": r.id,
        "to_user": {
            "username":r.to_username,
            "first_name":r.first_name,
            "last_name":r.last_name,
            "phone":r.phone
          },
        "body": r.body,
        "sent_at": r.sent_at,
        "read_at": r.read_at        
      }));
        // Add to_user to all 

      return messagesFrom;

    }catch(err){
      next(err);
    }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { 
    try{
      const results = await db.query(`
      SELECT m.id, 
        m.from_username, 
        m.body, 
        m.sent_at, 
        m.read_at,
        u.first_name,
        u.last_name,
        u.phone
      FROM messages AS m
        RIGHT JOIN 
          users AS u
        ON m.from_username = u.username
      WHERE m.to_username=$1`,[username]);

      if(results.rows.length === 0){
        return new ExpressError('Username not found!',401);
      }

      const messagesTo = results.rows.map(r => ({
      "id": r.id,
      "from_user": {
          "username":r.from_username,
          "first_name":r.first_name,
          "last_name":r.last_name,
          "phone":r.phone
        },
      "body": r.body,
      "sent_at": r.sent_at,
      "read_at": r.read_at        
      }));
      // Add to_user to all 
    
      return messagesTo;

    } catch(err){
      next(err);
    }
  }
}

// User.register({"username":'spongebob',"password":'test',"first_name":'sponge',"last_name":'bob',"phone":'1233456'});

// User.authenticate('spongebob','test')

// User.updateLoginTimestamp('spongebob');

// User.get('spongebob');

// User.messagesTo('spongebob');

// User.updateLoginTimestamp('dne');

module.exports = User;