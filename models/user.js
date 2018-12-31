const bcrypt = require('bcryptjs');
const db = require('../config/database'); //db connection string
const  pg     = require('pg');
const client      =  new  pg.Client(db);

client.connect();



module.exports.getUserByUsername = function(usr, callback)  {
    const query = "select * from account where username  = '"+usr+"'";
    client.query(query, (err, result) =>{       
        callback(err, result.rows[0]);
    });       
}

module.exports.getUserById = function(id, callback)  {
    const query = "select * from account where id  = '"+id+"'";
    client.query(query, (err, result) =>{        
        callback(err, result);
    }); 
}

module.exports.addUser = function(newUser, callback)  {
    const query = "INSERT INTO account(type, name, email, phone, address, username, password) values($1, $2, $3, $4, $5, $6, $7)";
    //console.log(newUser.password);
    bcrypt.genSalt(10, (err,salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            //console.log(newUser.password);
            if(err){
                throw err;
            }
            client.query(query, [newUser.type, newUser.name, newUser.email,newUser.phone,
                                 newUser.address, newUser.username, newUser.password], (err, result)=>{
                callback(err, result);
                                 });
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
       // if (err) throw err;       
        callback(null, isMatch);
    });
}