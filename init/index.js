const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

const initdb = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("initialized successfully");
};

main().then(async () => {
    console.log("connected successfully");
    await initdb();
    mongoose.connection.close();
}).catch((err) => {
    console.log(err);
});