const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const {Listing} = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");

app.set("view engine", "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")))
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}


main().then(()=>{
    console.log("connected succesfully");
}).catch((err)=>{
    console.log(err);
});


// app.get("/listing",async (req,res)=>{
//     const list1 = new Listing({
//         title:"My home",
//         descreption : "Near beach",
//         price:1230,
//         location:"GOA",
//         country:"India",
//     });
//     await list1.save();
//     res.send("data aved succesfully");
// })


//Index  route

app.get("/listing",async (req,res)=>{
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs",{
        alllisting,
    });
   
});


//Create Route

app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});


//Post the route
app.post("/listing/:id",async (req,res)=>{
    let {id} = Listing.findById(id);

    let newlist = new Listing(req.body.listing);
    await 
    res.redirect("/listing");
});

//Edit the route 
app.get("/listing/:id/edit",async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{
        list:listing,
    });
});

//post the edited route;
app.put("/listing/:id/",async (req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing")
});


app.delete("/listing/:id/",(req,res)=>{
    let {id} = req.params;
    Listing.findByIdAndDelete(id);
    res.redirect("/listing")
});

// Show Route
app.get("/listing/:id",async (req,res)=>{
    let {id} = req.params;
    const listing  = await Listing.findById(id);
    console.log(listing);
    res.render("listing/show.ejs",{
        listing
    });
});



app.get("/",(req,res)=>{
    res.send("Server is working");
});


app.listen(port,(req,res)=>{
    console.log(`port runs under ${port}`);
});

