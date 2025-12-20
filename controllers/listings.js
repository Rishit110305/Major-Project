// controllers/listings.js
const { cloudinary } = require("../cloudConfig");
const Listing = require("../models/list");
const { geocodeLocation } = require("../utils/geocode.js"); // <- IMPORTANT
// other imports if present
// const wrapAsync = require("../utils/wrapAsync.js"); etc.

module.exports.index = async (req, res) => {
  const { search } = req.query;

  let filter = {};

  if (search) {
    filter = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { country: { $regex: search, $options: "i" } },
      ],
    };
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", { allListings, search });
}; // USED filter for searching 

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.createListing = async (req, res) => {
  try {
    const { title, description, price, location, country } = req.body.listing;

    // GEOCODE LOCATION
    const coords = await geocodeLocation(location, country);
    // coords should be: { lat, lng }

    //  STOP if geocoding fails
    if (!coords) {
      req.flash("error", "Invalid location. Please enter a valid city and country.");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      geometry: {
        type: "Point",
        coordinates: [coords.lng, coords.lat] // ✅ ONLY valid coords
      },
      owner: req.user._id
    });

    // IMAGE IF UPLOADED
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    await newListing.save();

    req.flash("success", "New listing created!");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.log("Create listing error:", err);
    req.flash("error", "Failed to create listing.");
    res.redirect("/listings/new");
  }
};


module.exports.showListing = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Use .populate('owner') to fetch the actual user document data
    const listing = await Listing.findById(id)
        .populate("owner") 
        .populate({ // This ensures reviews and the author of each review are populated
            path: 'reviews',
            populate: {
                path: 'author'
            }
        });

    if (!listing) {
        // Handle case where listing is not found (e.g., flash message and redirect)
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  } catch (err) {
    next(err);
  }
};

module.exports.editListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Cannot find that listing.");
    return res.redirect("/listings");
  }

  const originalImage = listing.image?.url;

  //  Extract existing coordinates safely
  const coordinates =
    listing.geometry && listing.geometry.coordinates
      ? listing.geometry.coordinates
      : [77.2090, 28.6139]; // fallback only for display

  res.render("listings/edit", {
    listing,
    originalImage,
    coordinates, //  pass to edit.ejs if map is used
  });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;

  // Find listing
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Extract updated fields
  const { title, description, price, location, country } = req.body.listing;

  // If location or country changed → re-geocode
  if (location !== listing.location || country !== listing.country) {
    const newCoords = await geocodeLocation(location, country);

    // stop update if geocode fails
    if (!newCoords) {
      req.flash("error", "Invalid location. Please enter a valid city and country.");
      return res.redirect(`/listings/${id}/edit`);
    }

    //  CORRECT FIELD
    listing.geometry.coordinates = [newCoords.lng, newCoords.lat];
  }

  // Update fields
  listing.title = title;
  listing.description = description;
  listing.price = price;
  listing.location = location;
  listing.country = country;

  // Update image if a new file was uploaded
  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await listing.save();

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Cannot find that listing.");
      return res.redirect("/listings");
    }
    // delete cloudinary images if needed
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};
