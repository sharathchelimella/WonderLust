const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressErrors");
const {listingSchema} = require("./schema.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);

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

// Index route
app.get("/listing", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", {
        alllisting,
    });
}));

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Create Route
app.get("/listing/new", (req, res) => {
    res.render("listing/new.ejs");
});

// Post the route (Create new listing)
app.post("/listing", validateListing, wrapAsync(async (req, res, next) => {
    let listingData = req.body.listing;

    if (typeof listingData.image === "string") {
        let url = listingData.image.trim();
        listingData.image = url ? { filename: "listingimage", url } : undefined;
    } else if (listingData.image && typeof listingData.image.url === "string") {
        let url = listingData.image.url.trim();
        if (url) {
            listingData.image = { filename: listingData.image.filename || "listingimage", url };
        } else {
            delete listingData.image;
        }
    }
    const newlist = new Listing(listingData);
    await newlist.save();
    res.redirect("/listing");
}));

// Edit the route 
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listing/edit.ejs", {
        list: listing,
    });
}));

// Post the edited route (Update listing)
app.put("/listing/:id", validateListing, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let listingData = req.body.listing;
    if (typeof listingData.image === "string") {
        let url = listingData.image.trim();
        if (url) {
            listingData.image = { filename: "listingimage", url };
        } else {
            delete listingData.image;
        }
    } else if (listingData.image && typeof listingData.image.url === "string") {
        let url = listingData.image.url.trim();
        if (url) {
            listingData.image = { filename: listingData.image.filename || "listingimage", url };
        } else {
            delete listingData.image;
        }
    }
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listingData });
    if (!updatedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect(`/listing/${id}`);
}));

// Delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
   
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.redirect("/listing");
}));

// Show Route
app.get("/listing/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    res.render("listing/show.ejs", {
        listing,
    });
}));

app.get("/", (req, res) => {
    res.redirect("/listing");
});

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    // res.status(status).send(message);
    res.status(status).render("./error.ejs",{message});
});

app.listen(port, () => {
    console.log(`port runs under ${port}`);
});


