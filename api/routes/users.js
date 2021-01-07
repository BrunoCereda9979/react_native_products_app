const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Schemas
const User = require('../models/user');
const { route } = require('./products');
const { json } = require('body-parser');
const user = require('../models/user');

//Routes
router.post('/signup', (req, res, next) => {
    User.find({userEmail: req.body.userEmail}).exec()
    .then(user => {
        if (user.length >= 1) {
            res.status(409).json({
                message: 'Sorry! ¡That email is taken!',
                status: 409
            });
        }
        else {
            bcrypt.hash(req.body.userPassword, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        message: '¡Sorry! ¡There is an error with the server!',
                        error: err,
                        status: 500
                    });
                }
                else {
                    const newUser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        userEmail: req.body.userEmail,
                        userPassword: hash
                    });
                    newUser.save()
                    .then(user => {
                        console.log(user)
                        res.status(201).json({
                            message: '¡New account created succesfully!',
                            status: 200,
                            createdAccount: {
                                userId: user._id,
                                userEmail: user.userEmail,
                                request: {
                                    method: 'GET',
                                    description: 'Get aditional information about the user',
                                    url: 'http://localhost:3000/users/' + user._id
                                }
                            }
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: '¡Sorry! ¡Could not create new account!',
                            error: err,
                            status: 500
                        })
                    })
                }
            })
        }
    })
});

router.post('/login', (req, res, next) => {
    console.log(req.body)
    User.find({userEmail: req.body.userEmail}).exec()
    .then(user => {
        if (user.length < 1) {
            res.status(401).json({
                message: '¡Sorry! ¡You are not registered to the page!',
                status: 401
            })
        }
        bcrypt.compare(req.body.userPassword, user[0].userPassword, (err, result) => {
            if (err) {
                res.status(500).json({
                    message: '¡Sorry! ¡Authentication failed!',
                    status: 500
                })
            }
            else if (result) {
                const authToken = jwt.sign({userEmail: user[0].userEmail, userId: user[0]._id,}, 'secret', {expiresIn: '1h'});
                console.log(authToken)
                return res.status(200).json({
                    message: '¡Login Successful!',
                    status: 200,
                    token: authToken
                })
            }
            res.status(401).json({
                message: 'Sorry! Authentication failed!',
                status: 401
            })
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! Couldt log you in!',
            error: err,
            status: 500
        })
    })
});

router.delete('/:userId', (req, res, next) => {
    console.log(req.params.userId)
    User.remove({_id: req.params.userId}).exec()
    .then(result => {
        res.status(200).json({
            message: '¡User deleted successfully!',
            status: 200
        })
    })
    .catch(err => {
        res.status(500).json({
            message: 'Sorry! There is an error with the server!',
            error: err,
            status: 500
        })
    })
});

module.exports = router;