var express 				= require("express"),
	app 					= express(),
	bodyParser 				= require("body-parser"),
	flash 					= require("connect-flash"),
	mongoose 				= require("mongoose"),
	passport 				= require("passport"),
	LocalStrategy			= require("passport-local"),
	passportLocalMongoose 	= require("passport-local-mongoose"),
	User					= require("./models/user"),
	Booking 				= require("./models/book")

// requiring routes
var home = require("./routes/home"),
	dashboard = require("./routes/dashboard")

// connecting to db
mongoose.connect("mongodb+srv://Adarsh:pass@cluster0.sd1cc.mongodb.net/GoluDada?retryWrites=true&w=majority", {
	config: {autoIndex: false}, 
	useNewUrlParser: true
}).then(() =>{
	console.log('connected to DB...');
}).catch(err => {
	console.log('ERROR: ', err.message);
});
// use codes
app.use(bodyParser.urlencoded({extended: true}));
// using flash
app.use(flash());

app.use(require("express-session")({
	secret: "This is my secret",
	resave: false,
	saveUninitialized: false
}));
// using public directory
app.use(express.static("public"));
// passport auths
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set  & use routes
app.set("view engine", "ejs");
app.use(function(req, res, next){
	res.locals.currentUser 	= req.user;
	res.locals.message 		= req.flash("error");
	res.locals.success 		= req.flash("success");
	next();
});
	// using required routes
	app.use("/",home);
	app.use(dashboard);

app.listen(process.env.PORT || 3000, function(req, res){
	console.log("goluDada serever started...")
});