var express = require("express"),
	router  = express.Router(),
	mongoose= require("mongoose"),
	passport= require("passport"),
	Booking = require("../models/book"),
	User 	= require("../models/user")



router.get("/dashboard", isLogedIn, function(req, res){
	res.render("dashboard", {success: "Welcome "+ req.user.username});
});


// get routes

router.get("/rparty", isLogedIn, function(req, res){
	Booking.find({}, function(err, fb){
		if(err){
			console.log(err);
			res.redirect("back");
		}else {
			var b = [];

			for(i=0; i<fb.length; ++i){
				for(j=i+1; j<fb.length; ++j){
					if(fb[i].status > fb[j].status){
						var t = fb[j];
						fb[j] = fb[i];
						fb[i] = t;
					}
				}
			}
			}
			for(i=0; i<fb.length; i++){
				b.push(fb[i]);
			}
			res.render("rparty", {rb: b});
	});
});
router.get("/:id/rparty", isLogedIn, function(req, res){
	Booking.findById(req.params.id, function(err, fb){
		if (err){
			console.log(err);
			res.redirect("back");
		}else {
			res.render("edit", {b: fb});
		}
	})
});
router.get("/bookings", isLogedIn, function(req, res){
	Booking.find({}, function(err, b){
		if(err){
			console.log(err);
			res.redirect("/dashboard");
		}
		res.render("bookings", {Bookings: b});
	})
	
});
router.get("/edetails", isLogedIn, function(req, res){
	Booking.find({}, function(err, fb){
		if(err){
			console.log(err);
			res.redirect("back");
		}else {
			var e = [],
				p = []
			fb.forEach(function(fb){
				e.push(fb.emp);
				if(fb.emp !== null){
					p.push(fb.name);
				}
			})
			res.render("edetails", {emp: e, party: p});
		}
	})
});
router.get("/cadmin", isLogedIn, function(req, res){
	res.render("cadmin");
});

// booking details
router.get("/:id/bookingDetails", isLogedIn, function(req, res){
	Booking.findById(req.params.id, function(err, booking){
		if(err){
			console.log(err);
			res.redirect("back");
		}else {
			res.render("bookingDetails", {b: booking});
		}
	})
});
// running bookings
router.get("/:id/rbookingDetails", isLogedIn, function(req, res){
	Booking.findById(req.params.id, function(err, booking){
		if(err){
			console.log(err);
			res.redirect("back");
		}else {
			res.render("rbookingDetails", {b: booking});
		}
	})
});
// removing booking
router.get("/:id/deleteBooking", isLogedIn, function(req, res){
	Booking.findByIdAndRemove(req.params.id, function(err, fb){
		if(err){
			console.log(err);
			res.redirect("back");
		}else {
			res.redirect("/bookings");
		}
	})
});
// logout logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You out..!");
	res.redirect("/");
});



// post routes
	// cadmin logic
	router.post("/cadmin", isLogedIn, function(req, res){
		User.register( new User({username: req.body.username}), req.body.password, function(err, user){
			if(err){
				req.flash("error", err.message);
				res.redirect("/cadmin");
			}
			passport.authenticate("local")(req, res, function(){
				req.flash("success", "Co-Admin Added...");
				res.redirect("/dashboard");
			})
		})
	});
	// updating booking
	router.post("/:id/rparty", isLogedIn, function(req, res){
		Booking.findByIdAndUpdate(req.params.id, req.body.b, function(err, fb){
			if(err){
				res.redirect("back");
			}else {
				res.redirect("/rparty");
			}
		})
	});
// middleware
function isLogedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You don't have permission to do that...");
	res.redirect("/login");
}


module.exports = router;