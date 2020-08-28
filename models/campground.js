let mongoose = require("mongoose");

// Schema Set Up
let campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    price: String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"            
        }
    ]
});

// Model Set Up
module.exports =  mongoose.model("Campground", campgroundSchema);
