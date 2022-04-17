//const express = require('express');
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const connection = require('../database/db');
const dotenv = require('dotenv')
dotenv.config();

router.post('/obtain', async (req, res) => {
    // check for basic auth header
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // check user if exits or not
    var sql = 'SELECT password FROM users WHERE username = ?';
    connection.query(sql, [username, password], await function (err, rows) {
        if (err) throw err
        if (rows.length == 0) {
            return res.status(401).json({
                responseCode: '401',
                responseMsg: 'Invalid Authentication Credentials',
                content: [null]
            });
        } else {
            // check password matching
            if (rows[0].password == password) {
                jwtSignIn(username);
            } else {
                return res.status(401).json(
                    {
                        responseCode: '401',
                        responseMsg: 'Invalid Password Credentials',
                        content: [null]
                    }
                );
            }

        }
    })
    

    // generateToken
    function jwtSignIn(username) {
        jwt.sign({ username: username }, process.env.SECRETE_KEY, { expiresIn: '30d' }, (err, token) => {
            if(err) throw err
            res.status(201).json({
                responseCode: '201',
                responseMsg: 'Sucess',
                content: [{ token: token }]
            });
        });
    }

   

})

module.exports = router
    
