const express = require('express');
const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
// let config = require('./config');

let generateToken = (username) => {
    // let username = req.body.name;
        let token = jwt.sign({
            username: username
        },
        process.env.JWS_SECRET,
          { expiresIn: '24h' } //expires in 24 hours, put in env
        );
        return token
}

let verifyToken = (req) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    decoded = jwt.verify(token, process.env.JWS_SECRET);
    return decoded.username
    }
}

module.exports = {
  verifyToken,
  generateToken
}