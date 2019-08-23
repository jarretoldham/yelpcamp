//express set up 
var express = require("express"); 
var app = express(); 

//mongoose setup 
var mongoose = require("mongoose"); 
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useFindAndModify: false }); 

//body-parser set up 
var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({extended: true}));  

//Passport setup 
var passport = require("passport"); 
var LocalStrategy = require("passport-local"); 

//Setup for connect-flash
var flash = require("connect-flash"); 
app.use(flash()); 

//Get modules from other files
// var Campground = require("./models/campground"); 
// var Comment = require("./models/comment"); 
var User = require("./models/user"); 

//get routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

//method override 
var methodOverride = require("method-override"); 
app.use(methodOverride("_method"));

//Seed Database 
seedDB = require("./seeds"); 
// seedDB(); 

//set ejs as the default view engine for express 
app.set("view engine", "ejs"); 

//allow access to the public directory 
app.use(express.static(__dirname + "/public")); 

// Passport Configuration
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for passing the current user to all the routes
app.use(function(request, response, next) {
    response.locals.currentUser = request.user; 
    //passing the flash message to all the pages 
    response.locals.error = request.flash("error"); 
    response.locals.success = request.flash("success"); 
    //need next to move on to the next item in the middleware
    next(); 
})

//telling app to use the routing files required above
app.use("/", indexRoutes); 
app.use("/campgrounds/:id/comments", commentRoutes); 
app.use("/campgrounds", campgroundRoutes); 

//Start the App 
app.listen(3000, function() {
    console.log("YelpCamp App Started"); 
}); 