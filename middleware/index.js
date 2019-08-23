var Campground = require("../models/campground"), 
    Comment = require("../models/comment"); 

//Houses middleware used in the yelpcamp app 
var middlewareObj = {}; 

middlewareObj.checkCampgroundOwnership = function(request, response, next) {
    if(request.isAuthenticated()) {
        Campground.findById(request.params.id, function(error, campground) {
            if(error || !campground) {
                request.flash("error", "Campground could not be found"); 
                response.redirect("back"); 
            } else {
                if(campground.author.id.equals(request.user._id)) {
                    next(); 
                } else {
                    request.flash("error", "Permission Denied"); 
                    response.redirect("back"); 
                }
            }
        });  
    } else {
        request.flash("error", "Please login to do that"); 
        response.redirect("back"); 
    }
}

middlewareObj.checkCommentOwnership = function(request, response, next) {
    if(request.isAuthenticated()) {
        Comment.findById(request.params.comment_id, function(error, comment) {
            if(error || !comment) {
                request.flash("error", "Sorry, that comment doesn't exist!")
                response.redirect("back"); 
            } else {
                if(comment.author.id.equals(request.user._id)) {
                    next(); 
                } else {
                    request("error", "Permission denied"); 
                    response.redirect("back"); 
                }
            }
        });  
    } else {
        response.redirect("back"); 
    }
}

middlewareObj.isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
        return next(); 
    } else {
        request.flash("error", "Please login to do that"); 
        response.redirect("/login"); 
    }
}

module.exports = middlewareObj; 