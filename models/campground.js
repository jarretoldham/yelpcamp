var mongoose = require("mongoose"); 
var Comment = require("./comment"); 

//Schema Setup (to refactor later)
var campgroundSchema = new mongoose.Schema({
    name: String, 
    image: String, 
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }, 
        username: String
    }, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Comment"
        }
    ], 
    price: String
});

module.exports = mongoose.model("Campground", campgroundSchema); 
