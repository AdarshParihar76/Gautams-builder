var express = require("express"),
	router  = express.Router(),
	mongoose= require("mongoose"),
	passport= require("passport"),
	Booking = require("../models/book") 

// get routes
router.get("/", function(req, res){
	res.render("home");
});
router.get("/login", function(req, res){
	res.render("login");
});
router.get("/about", function(req, res){
	res.render("about");
});
router.get("/contact", function(req, res){
	res.render("contact");
});
router.get("/book", function(req, res){
	res.render("book");
});

// post routes
	// Creating booking
	router.post("/book", function(req, res){
		Booking.create(
			{name: req.body.name, nperson: req.body.nperson, da: req.body.da, date: req.body.date, place: req.body.place, phone: req.body.phone, qa: req.body.qa, status: req.body.status, emp: req.body.emp},
			 function(err, b){
			 	if(err){
			 		console.log(err);
			 		res.redirect("back");
			 	}
			 	req.flash("success", "Your request has been sent successfully, You will recieve message soon...");
			 	res.redirect("/");
		});
	});

	// Login logic
	router.post("/login", passport.authenticate("local", {
			successRedirect: "/dashboard",
			failureRedirect: "/login",
			failureFlash: true
		}), function(req, res){
	});

// middleware
function isLogedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You don't have permission to do that...");
	res.redirect("/login");
}
	

// eporting it
module.exports = router;