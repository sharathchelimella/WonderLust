const express  = require("express");
const app  = express();

const post  = require("./routes/post.js");
const user = require("./routes/user.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getcookie",(req,res)=>{
    res.cookie("hello","great");
    res.cookie("madein","india");
    res.send("cookies has been saved");
});

//cookie parser

// app.get("/greet",(req,res)=>{
//     let {name = "anonymous"} = req.cookies;
//     res.send(`hi ${name}`);
// })


//cookies signed

app.get("/getssignedcookie",(req,res)=>{
    res.cookie("made-in","india", {signed : true})
    res.send("signed cookie send")
})

app.get("/signedcookie",(req,res)=>{
    console.log(req.signedCookies);
    res.send("signed cookied verified");
})




app.get("/",(req,res)=>{
    console.dir(req.cookies);
    res.send("Hi, I am root!");
})
 

//USER
app.use("/user",user);

//Post
app.use("/post",post)


app.listen(3000,(req,res)=>{
    console.log("port runs under 3000");
})