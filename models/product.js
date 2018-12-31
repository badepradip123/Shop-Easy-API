const bcrypt = require('bcryptjs');
const db = require('../config/database'); //db connection string
const  pg     = require('pg');

const client =  new  pg.Client(db);

client.connect();

module.exports.getProducts = function(callback)  {
    const query = "select * from product";
    client.query(query, (err, result) =>{
        callback(err, result.rows);
    });      
}

module.exports.getProductsBySellerId = function(id, callback)  {    
    //console.log(id);
    const query = "SELECT * FROM product WHERE seller_id=$1";
    client.query(query,[id], (err, result) =>{
        //console.log('--resul---'+err)
        callback(err, result.rows);
    });      
}

module.exports.getProductById = function(id, callback)  {    
    //console.log(id);
    const query = "SELECT  * FROM product WHERE id=$1";
    client.query(query,[id], (err, result) =>{
        callback(err, result.rows);
    });      
}


module.exports.getProductsBySearch = function(model, callback)  {    
    console.log(model);
    const query = "SELECT * FROM product WHERE LOWER(model) like '%"+model.toLowerCase()+"%'";
    console.log(query);
    client.query(query, (err, result) =>{
        console.log('--resul---'+err)
        callback(err, result);
    });      
}

module.exports.addProduct = function(newprodcut, callback)  {
    const query = "INSERT INTO product(price, features, seller_id, count, model, imagesPath) values($1, $2, $3, $4, $5, $6)";
    client.query(query, [newprodcut.price, newprodcut.features, newprodcut.seller_id,newprodcut.count,
                            newprodcut.model, newprodcut.imagespath], (err, result)=>{
        callback(err, result);
                            });
}

module.exports.addTransaction = function(newtrans, callback)  {
    const query = "INSERT INTO transaction(user_id, product_id, Date) values($1, $2, CAST(NOW() as Date))";
    client.query(query, [newtrans.user_id, newtrans.product_id], (err, result)=>{
        if (result) {
            const query2 = "UPDATE product SET COUNT = COUNT -1 WHERE id=$1"
            client.query(query2, [newtrans.product_id], (err, result2) =>{
                callback(err, result2);
            });            
        }else{
            callback(err, result);
        } 
        
    });
}

