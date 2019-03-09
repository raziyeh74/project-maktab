// const i=require("../server")
module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Express' });
      });
    // PROFILE SECTION =========================
    
  //   function isLogedIn(req, res, next) {
  //     console.log(req.isAuthenticated())
  //     if (req.isAuthenticated()) {
  //       console.log(req.user)
  //         return next();
  //     } else {
  //       console.log("is login false")
  //         return res.redirect("/login");
  
  //     }
  // }

        app.get('/profile', isLogedIn, function(req, res) {
          res.render('profile.ejs', {
              user : req.user
          });
      });

      function isLogedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
    
        res.redirect('/');
    }
    
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================
    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
          res.render('login.ejs', { });
      });

      // process the login form
      app.post('/login', passport.authenticate('local-login', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/login', // redirect back to the signup page if there is an error   
      }), function (req, res) {
        res.redirect("/");
      
      });

      // SIGNUP =================================
      // show the signup form
      app.get('/signup', function(req, res) {
          res.render('signup.ejs', { });
      });
      
      // process the signup form
      app.post('/signup', passport.authenticate('local-signup', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/signup', // redirect back to the signup page if there is an error
          
      }));

    
    

    
}
    