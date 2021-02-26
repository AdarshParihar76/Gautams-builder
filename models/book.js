var mongoose = require("mongoose"),
	passportLocalMongoose = require("passport-local-mongoose")

var BookingSchema = new mongoose.Schema({
	name: 		String,
	da: 		String,
	date:  		Date,
	place: 		String,
	phone: 		String,
	qa: 		String,
	nperson: 	Number,
	status: 	Number,
	emp: 		String  
});

BookingSchema.plugin(passportLocalMongoose);

var Booking = mongoose.model("Booking", BookingSchema);

module.exports = Booking;