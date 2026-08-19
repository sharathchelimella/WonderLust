const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", {
        alllisting,
    });
};


module.exports.rendernewform = (req, res) => {
    res.render("listing/new.ejs");
};

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listing/show.ejs", {
        listing,
    });
};

module.exports.createlisting = async (req, res, next) => {
    let listingData = req.body.listing || {};

    if (req.file) {
        let url = req.file.path || `/uploads/${req.file.filename}`;
        let filename = req.file.filename;
        listingData.image = { url, filename };
    } else if (typeof listingData.image === "string") {
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
    newlist.owner = req.user._id;
    await newlist.save();
    req.flash("success", "New listing created successfully!");
    res.redirect("/listings");
}



module.exports.redereditform = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
   
    res.render("listing/edit.ejs", {
        list: listing,
    });
}

module.exports.updatelisting = async (req, res, next) => {
    const { id } = req.params;
    let listingData = req.body.listing || {};
    if (req.file) {
        let url = req.file.path || `/uploads/${req.file.filename}`;
        let filename = req.file.filename;
        listingData.image = { url, filename };
    } else if (typeof listingData.image === "string") {
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
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};