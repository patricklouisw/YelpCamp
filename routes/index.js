const middlewareObj = require("../middleware");

let express     = require("express"),
    router      = express.Router(),
    User        = require("../models/user"),
    passport    = require("passport");

// ROUTING
router.get("/", function(req, res){
    res.render("landing");
});

// ==============
// Auth Routes
//1. show register form
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Yelp Camp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//2. Login
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//3. Logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!!!");
    res.redirect("/campgrounds");
});

module.exports = router;