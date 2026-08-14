const express  = require("express");
const app  = express();

const post  = require("./routes/post.js");
const user = require("./routes/user.js");
const cookieParser = require("cookie-parser");

const session = require("express-session")
const flash = require("connect-flash")
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// app.use(cookieParser("secretcode"));

// app.get("/getcookie",(req,res)=>{
//     res.cookie("hello","great");
//     res.cookie("madein","india");
//     res.send("cookies has been saved");
// });

// //cookie parser

// // app.get("/greet",(req,res)=>{
// //     let {name = "anonymous"} = req.cookies;
// //     res.send(`hi ${name}`);
// // })


// //cookies signed

// app.get("/getssignedcookie",(req,res)=>{
//     res.cookie("made-in","india", {signed : true})
//     res.send("signed cookie send")
// })

// app.get("/signedcookie",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("signed cookied verified");
// })


// app.get("/",(req,res)=>{
//     console.dir(req.cookies);      //These prints the not signed cookies
//     res.send("Hi, I am root!");
// })
 

// //USER
// app.use("/user",user);

// //Post
// app.use("/post",post)








//SESSIONS



const sectionOptions = {
    secret:"mysecretkey" ,
    resave:false, 
    saveUninitialized:true
} 

app.use(session(sectionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.succesmsg = req.flash("Success");  //to make the more simple flash we use the local with middleware
   res.locals.errormsg = req.flash("error");
   next();
})

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;           //Storing the data and using the sma session in the different routes
    req.session.name = name;
    if(name==="anonymous"){
        req.flash("error","user not registered please Register");
    }else{
        req.flash("Success","user registerd Successfully");
    }
    
    // res.send(name);
    // console.log(req.session);
    res.redirect("/hello");
});



app.get("/hello",(req,res)=>{
    // console.log(req.flash("Success"));
    // res.send(req.session.name);
//    res.locals.succesmsg = req.flash("Success");
//    res.locals.errormsg = req.flash("error");
    res.render("success.ejs",{name : req.session.name});  //we using the ssame session in this  route 
});






// app.get("/count",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent  a request ${req.session.count} times`)
// })


// app.get("/test",(req,res)=>{
//     res.send("cookie saved in the form of signature");
// })

// app.get("/addcookies",(req,res)=>{
//     res.cookie("hello","i am key"); // Even it will bi signed cookie
//     res.send("cokkie")
// })

app.listen(3000,(req,res)=>{
    console.log("port runs under 3000");
})