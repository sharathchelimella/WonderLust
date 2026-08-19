if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}


const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const User = require("./models/user.js")
const userrouter = require("./routes/user.js")
const listingsrouter = require("./routes/listing.js");
const reviewsrouter = require("./routes/review.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy  = require("passport-local");
const methodOverride = require("method-override");



const sessionOptions = {
    secret:"mySuperKey",
    resave : false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curentuser = req.user;
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async (req,res,next)=>{
//     let fakerUser = new User({
//         email:"sunny@gmail.com",
//         username: "Sunny",
//     });
//     let registerd = await User.register(fakerUser,"helloworld");
//     res.send(registerd);
// });
 
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main()
    .then(() => {
        console.log("connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/listings", listingsrouter);
app.use("/listings/:id/reviews", reviewsrouter);
app.use("/",userrouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status, statusCode, message } = err;
    let errStatus = typeof status === "number" ? status : (typeof statusCode === "number" ? statusCode : 500);
    let errMessage = message || "Something went wrong!";
    res.status(errStatus).render("error.ejs", { message: errMessage });
});

app.listen(port, () => {
    console.log(`port runs under ${port}`);
});




