var mongoose = require("mongoose"); 

var commentSchema = new mongoose.Schema(
    {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId, 
                ref: "User"
            }, 
            username: String
        }, 
        //add in campground reference for pre-removal function below 
        campground: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Campground"
        }
    }
);

//Pre-removal function to remove any references in the campground object upon deletion
commentSchema.pre('remove', async function(){
	try{
		await mongoose.model('Campground').findByIdAndUpdate(this.campground,{
			$pull:{
				comments:this._id
			}	
		}, (err,foundCampground)=>{
			if(err){
				console.log(err);
			}else{
				
			}
		});
	}catch(err){
		console.log(err);
	}
});

module.exports = mongoose.model("Comment", commentSchema); 