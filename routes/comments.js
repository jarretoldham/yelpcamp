var express = require("express"); 
var router = express.Router({mergeParams: true}); 
var Campground = require("../models/campground"); 
var Comment = require("../models/comment"); 
var middleware = require("../middleware"); 

//Comment New 
router.get("/new", middleware.isLoggedIn, function(request, response) {
    Campground.findById(request.params.id, function(error, campground) {
        if(error) {
            console.log(error); 
        } else {
            response.render("comments/new", {campground: campground}); 
        }
    }); 
});

//Comment Create - need to check if logged in to prevent unwarranted post requests
router.post("/", middleware.isLoggedIn, function(request, response) {
    Campground.findById(request.params.id, function(error, campground){
        if(error) {
            console.log(error); 
            response.redirect("/campgrouds"); 
        }
        else {
            Comment.create(request.body.comment, function(error, comment) {
                if(error) {
                    console.log(error); 
                    request.flash("error", "Oops! There was an error creating your comment. Please try again"); 
                    response.redirect("/campgrounds/" + request.params.id); 
                } else {
                    //add user and id to comment
                    comment.author.id = request.user._id; 
                    comment.author.username = request.user.username; 

                    //add the campground to the comment to remove references 
                    comment.campground = request.params.id; 

                    //save the comment and push into the campground's comment array
                    comment.save(); 
                    campground.comments.push(comment); 
                    campground.save(); 
                    request.flash("success", "Your comment was created successfully"); 
                    response.redirect("/campgrounds/" + request.params.id); 
                }
            }); 
        }
    });
}); 

//Edit Comment 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(request, response) {
    Campground.findById(request.params.id, function(error, campground) {
        if(error || !campground) {
            console.log(error); 
            request.flash("error", "This is embarrassing - we experienced an error. Please try again"); 
            response.redirect("back"); 
        } else {
            Comment.findById(request.params.comment_id, function(error, comment){
                if(error) {
                    console.log(error); 
                    request.flash("error", "Uh oh...something went wrong. Please try again.")
                    response.redirect("back"); 
                } else {
                    request.flash("success", "Comment created successfully"); 
                    response.render("comments/edit", {comment: comment, campground: campground}); 
                }
            }); 
        }
    }); 
}); 

//Update Comment 
router.put("/:comment_id", middleware.checkCommentOwnership, function(request, response) {
    Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(error, comment){
        if(error) {
            console.log(error); 
            request.flash("error", "Uh oh...something went wrong. Please try again.")
            response.redirect("back"); 
        } else {
            request.flash("success", "Comment updated successfully")
            response.redirect("/campgrounds/" + request.params.id); 
        }
    })  
}); 

//Destroy Comment 
router.delete('/:comment_id', middleware.checkCommentOwnership, (request ,response)=>{
	Comment.findById(request.params.comment_id,function(error, foundComment){
		if(error){
            request.flash("error", "Uh oh...something went wrong when deleting your comment. Please try again"); 
			response.redirect('back');
		}else{
            foundComment.remove();
            request.flash("success", "Your comment was successfully deleted...you can now fade into obscurity"); 
			response.redirect('/campgrounds/'+request.params.id);
		}
	});
});

module.exports = router; 