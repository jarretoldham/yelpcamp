var express = require("express"); 
var router = express.Router(); 
var passport = require("passport"); 
var User = require("../models/user"); 

//root route
router.get("/", function(request, response) {
    response.render("landing"); 
}); 

//Auth Routes
// show the register form 
router.get("/register", function(request, response) {
    response.render("register"); 
})

//sign up logic 
router.post("/register", function(request, response) {
    User.register(new User({username:request.body.username}), request.body.password, function(error, user){
        if(error) {
            console.log(error); 
            request.flash("error", error.message); 
            return response.redirect("back"); 
        }
        passport.authenticate("local")(request, response, function() {
            request.flash("success", "Welcome to YelpCamp " + user.username); 
            response.redirect("/campgrounds"); 
        }); 
    }); 
});

//show login form 
router.get("/login", function(request, response){
    response.render("login"); 
}); 

//sign in user 
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds", 
        failureRedirect: "/login"
    }),function(request, response) {
    
}); 

//log out 
router.get("/logout", function(request, response) {
    request.logout(); 
    request.flash("success", "You successfully logged out"); 
    response.redirect("/campgrounds"); 
})

module.exports = router; 