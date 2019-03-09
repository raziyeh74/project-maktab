// set up ======================================================================
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer  = require('multer');

const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
var port  = process.env.PORT || 8080;
var path = require('path');
const User = require("./app/models/user")


// configuration ===============================================================
mongoose.connect('mongodb://localhost/UserArticle'); // connect to our database

//require('./config/passport')(passport); // pass passport for configuration

// set up our express application===============================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');// set up ejs for templating
app.set('port', process.env.PORT || 8080);


app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({'extended': 'false'}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/views')));

//app.use(express.static(path.join(__dirname, '/script')));


// required for passport=======================================================
app.use(session({
    secret: 'ilove my mother.', // session secret
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000000 }
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("sereiize")
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        console.log("deserialize")
        User.findById(id, function(err, user) {
            console.log(User)
            done(err, user);
        });
    });

    passport.use("local-login", new LocalStrategy(

    function (username, password, done) {
        console.log("local login");
        User.findOne({ userName: username },function (err, user) {
            if (err) {
                console.log(err + ">>>>>>>>>>>>>>>>>>>>..");
                return done(err);
            }
            if (!user) {
                console.log("not found" + ">>>>>>>>>>>>>>>>>>>>..");
                return done(null, false, {});
            }
            if (user.password !== password) {
                console.log("The password is incorrect >>>>>>>>>>>>>>");
                return done(null, false, {});
            }
            // all is well, return user
            else
            return done(null, user);
        });
    }));

    // passport.use('local-signup', new LocalStrategy(
    //     function (Username, Password, done) {
            
        
        

    //  }));





    // function isLogedIn(req, res, next) {
    //     if (req.isAuthenticated()) {
    //         return next();
    //     } else {
    //         return res.redirect("/login");
    
    //     }
    // }

    module.exports = {
        isLogedIn: (req,res,next) => {
            console.log("islogin")
            if(req.isAuthenticated()){
                console.log("truuuuuuuuuuuuuuuuuuuuuuuuu")
                return next();
            }
            else {
                console.log("falssssssssssss")
               return res.redirect ("/login");
            }
            
        }
    };

app.post("/signup", function (req, res) {
    User.find({
        userName: req.body.username
    }, function (err, data) {
        if (err) {
            res.send("erorrrrr")
        }
        if (data.length) {
            res.send({
                "username": false
            });
        } else {
            let user = new User({
                firstName: req.body.fisrtName,
                lastName: req.body.lastName,
                userName: req.body.username,
                password: req.body.password,
                ConfirmPassword: req.body.ConfirmPassword,
                MobileNumber: req.body.MobileNumber,
                Gender: req.body.Gender,
            });
            user.save(function (err, user) {
                if (err) {
                    res.send("error");
                }
                res.send({
                    "username": true
                })
                // return res.redirect('/login')
            })
        }
    })

});

// app.post("/singIn", passport.authenticate('local-login', {
//     failureRedirect: "/login",
//     successRedirect: '/dashbord',
// }), function (req, res) {
//     res.redirect("/");
// });

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});


// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);













