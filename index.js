const express     = require('express');
const passport    = require('passport');
const bodyParser  = require('body-parser');
const cors        = require('cors');

const app         = express(); 
const port        = 3000; //set port 3000
const users       = require('./routes/users'); 
const product     = require('./routes/product');

//cors middleware
app.use(cors());



//Third-party middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



/*-----Routes Of User------ */
app.use('/users', users); 
app.use('/product', product);
app.use('/uploads', express.static('uploads'));

/*-------Passport-------- */
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



app.listen(port, () => {
    console.log(`server started port at ${3000}`);
});


