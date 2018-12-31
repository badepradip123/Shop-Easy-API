const express =  require('express');
//Router - determining how an application responds to a client request to a particular endpoint
const router =  express.Router(); 
const passport = require('passport');
const config =  require('../config/database');
const jwt = require('jsonwebtoken');
const User  = require('../models/user');

//Register User
router.post('/register', (req,res) => {     
    let newUser = {
        type:     req.body.type,
        name:     req.body.name,
        email:    req.body.email,
        phone:    req.body.phone,
        address:  req.body.address,
        username: req.body.username,
        password: req.body.password        
    }; 
     
    User.addUser(newUser, (err, user) => {
        //console.log(user);
        if(err){
            res.json({success: false, msg: 'Failed to register user' });
        }
        else {
            res.json({success: true, msg: 'User registered' });
        }
    }); 
     
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(!user){            
            res.json({success: false, msg: 'Invlid Username'});            
            }
          
       else{
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err)  throw err;
            if(isMatch){
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 60480000 // 1 week
                });
                //console.log('>>>>>>>>>'+user.type);  
                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                            id: user.id,
                            name: user.name,
                            username: user.username,
                            email: user.email,
                            address: user.address,
                            type: user.type
                            
                        }
                });
            }else{
                res.json({success: false, msg: 'Invlid Password'});
            }
        });
    }
    });
});


module.exports =  router;
