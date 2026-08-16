const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressErrors.js");
const Listing = require("../models/listing.js");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Index route
router.get("/", wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", {
        alllisting,
    });
}));

// Create Route
router.get("/new", (req, res) => {
    res.render("listing/new.ejs");
});

// Post the route (Create new listing)
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    let listingData = req.body.listing || {};

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
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}));

// Edit the route 
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
   
    res.render("listing/edit.ejs", {
        list: listing,
    });
}));

// Post the edited route (Update listing)
router.put("/:id", validateListing, wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    let listingData = req.body.listing || {};
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
    let updatedListing = await Listing.findByIdAndUpdate(id, { ...listingData }, { runValidators: true, new: true });
    if (!updatedListing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
}));

// Delete route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
}));

// Show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", {
        listing,
    });
}));

module.exports = router;
