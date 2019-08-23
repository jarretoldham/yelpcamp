var express = require("express"); 
var router = express.Router(); 
var Campground = require("../models/campground"); 
var Comment = require("../models/comment"); 
var middleware = require("../middleware"); 

//Campground Index
router.get("/", function(request, response) {
    campgrounds = Campground.find(function(error, campgrounds) {
        if(error) {
            console.log("error: " + error); 
        } else {
            response.render("campgrounds/index", {campgrounds: campgrounds}); 
        }
    }); 
}); 

//Campground Create
router.post("/", middleware.isLoggedIn, function(request, response) {
    //get data from the form
    var campground = new Campground(
        {
            name: request.body.name, 
            image: request.body.image,
            description: request.body.description, 
            author: {
                id: request.user._id, 
                username: request.user.username
            }, 
            price: request.body.price
        }
    ); 

    campground.save(function(error, campground){
        if (error) {
            console.log("ERROR: " + error); 
        } else {
            response.redirect("campgrounds"); 
        }
    }); 
}); 

//Campground New 
router.get("/new", middleware.isLoggedIn, function(request, response) {
    response.render("campgrounds/new"); 
}); 

//Campground Show (needs to be below /new)
router.get("/:id", function(request, response) {
    Campground.findById(request.params.id).populate("comments").exec(function(error, foundCampground) {
        if(error || !foundCampground) {
            request.flash("error", "We couldn't find the campground you were looking for"); 
            console.log("ERROR: " + error); 
            response.redirect("back"); 
        } else {
            response.render("campgrounds/show", {campground: foundCampground}); 
        }
    }); 
}); 

//Campground Edit 
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(request, response) {
        Campground.findById(request.params.id, function(error, campground) {
            response.render("campgrounds/edit", {campground: campground});
        })
}); 

//Campground Update
router.put("/:id", middleware.checkCampgroundOwnership, function(request, response) {
    Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(error, campground) {
        if(error) {
            request("error", "Oops! Something went wrong. Please try again"); 
            console.log(error); 
            response.redirect("/campgrounds"); 
        } else {
            request.flash("success", "Campground successfully updated"); 
            response.redirect("/campgrounds/" + request.params.id); 
        }
    }); 
}); 

// Campground Destroy 
router.delete("/:id", middleware.checkCampgroundOwnership, function(request, response) {
    Campground.findByIdAndRemove(request.params.id, function(error, campground) {
        if(error) {
            request.flash("error", "There was an error deleting the campground"); 
            console.log(error); 
            response.redirect("campgrounds/" + request.params.id); 
        } else {
            Comment.deleteMany({_id: {$in: campground.comments} }, (err) => {
                if(err) {
                    console.log(err); 
                    response.redirect("/campgrounds"); 
                }
                request.flash("success", "Successfully removed the " + campground.name + " campground"); 
                response.redirect("/campgrounds"); 
            })
        }
    }); 
}); 

module.exports = router; 