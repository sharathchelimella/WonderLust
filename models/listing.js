const mongoose = require("mongoose");


const listingSchema = mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description: String,
    image: {
        type:String,
        default:"https://www.magnific.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_3531881.htm#fromView=keyword&page=1&position=0&uuid=8ebfe6ca-4f6c-4951-987b-b85a3f64475f&query=Sunset",
        set:(v)=>v=== ""?v:"https://www.magnific.com/free-photo/sunset-time-tropical-beach-sea-with-coconut-palm-tree_3531881.htm#fromView=keyword&page=1&position=0&uuid=8ebfe6ca-4f6c-4951-987b-b85a3f64475f&query=Sunset",
    },
    price:Number,
    location: String,
    country: String,
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = {Listing};
