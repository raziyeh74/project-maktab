// load the things we need
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define the schema for our user model
const user = new Schema({    
    
    firstName: String,
    lastName: String,
    userName: String,
    password:String,
    ConfirmPassword:String,
    MobileNumber:String,
    Gender:String,
    essay:[{title:String,shortText:String,text:String,date:Date}]

});

// create the model for users and expose it to our app
module.exports = mongoose.model('user', user);
