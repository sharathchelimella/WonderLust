const mongoose = require("mongoose");
const initdata = require("./data.js");
const {Listing} = require("../models/listing");


async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{
    console.log("connected succesfully");
}).catch((err)=>{
    console.log(err);
});


const initdb =async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("instilaized successfully");
    
}
initdb();