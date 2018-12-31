const express =  require('express');
const router =  express.Router(); 
const passport = require('passport');
const Product  = require('../models/product');
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + '-' + file.originalname);
    },

});
const upload = multer({storage: storage})


//get all products
router.get('/', (req, res, next) => {
    Product.getProducts((err,product) => {
        if(err){
            res.json({success: false, msg: 'Failed to get products' });
        }
        else {            
            res.json(product);
        }
    });       
  });

//get all products by seller Id
router.get('/seller/:id',passport.authenticate('jwt', { session: false}), (req, res, next)=> {    
    Product.getProductsBySellerId(req.params.id, (err,product) => {
        if(err){
            res.json({success: false, msg: 'Failed to get products' });
        }
        else {            
            res.json(product);
        }
    });               
}); 

//get all products by product Id
router.get('/:id',passport.authenticate('jwt', { session: false}), (req, res, next)=> {    
    Product.getProductById(req.params.id, (err,product) => {
        if(err){
            res.json({success: false, msg: 'Failed to get products' });
        }
        else {            
            res.json(product);
        }
    });               
}); 

router.post('/transaction',passport.authenticate('jwt', { session: false}), (req, res, next)=> {  
    const trans = {
        user_id : req.body.user,
        product_id: req.body.product
    }  
    Product.addTransaction(trans, (err,result) => {
        if(err){
            res.json({status: false, msg: 'Failed to add transaction' });
        }
        else {            
            res.json({status: true, msg: 'Successfuly added transaction' });
        }
    });               
}); 

//get  products by search product name
 router.post('/search', (req, res, next)=> {    
     console.log(req.body.model);
    Product.getProductsBySearch(req.body.model, (err,product) => {
        if(err){
            res.json({success: false, msg: 'Failed to get products' });
        }
        else {            
            res.json(product);
        }
    });               
}); 


// add products by seller
router.post('/add', upload.array("uploads[]", 12), (req, res, next) => {
    let imagespath = [];
    for(let i =0; i < req.files.length; i++){
        imagespath.push(req.files[i].path)
    }
     var newProduct = {
        price:     req.body.price,
        features:  req.body.features,
        model:     req.body.model,
        seller_id: req.body.seller_id,
        count:     req.body.count,        
        imagespath: imagespath        
        }; 

      Product.addProduct(newProduct, (err, product) => {
        if(err){
           
            res.json({success: false, msg: 'Failed to add product' });
        }
        else {
            res.json({success: true, msg: 'Product added',product: product });
        }
    });           
  });

module.exports =  router;
