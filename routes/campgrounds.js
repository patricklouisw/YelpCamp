const middlewareObj = require("../middleware");

let express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground")

router.get("/", function(req, res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

router.post("/", middlewareObj.isLoggedIn, function(req, res){
    //get data from form and add to campground array
    let name = req.body.name;
    let image = req.body.image;
    let price = req.body.price;
    let description = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCampground = {name: name, image: image, description: description, author: author, price: price};
    
    //Create a new Campground and save it to DB
    Campground.create(newCampground, function(err, newCampground){
        if(err){
            console.log("err");
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middlewareObj.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

router.get("/:id", function(req, res){
    // Find the Campground with provided id
    Campground.findById(req.params.id)
    .populate("comments")
    .exec( function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campgound not found");
            return res.redirect("back");
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });  
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found!");
            res.redirect("back");
        }
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campgroundRemoved){
        if(err){
            res.redirect("/campgrounds");
        } else {
            Comment.deleteMany({_id: { $in: campgroundRemoved.comments } }, (err)=> {
                if(err){
                    console.log(err);
                }
                req.flash("success", "Campground is successfully deleted!");
                res.redirect("/campgrounds");
            })
        }
    });
});

module.exports = router;