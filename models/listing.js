const mongoose = require("mongoose");

const defaultUrl = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60";

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: defaultUrl,
            set: (v) => (v === "" || !v ? defaultUrl : v),
        },
    },
    price: Number,
    location: String,
    country: String,
});

module.exports = mongoose.model("Listing", listingSchema);