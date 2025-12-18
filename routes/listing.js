const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/list.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // for uploading files

// / → index + create
router.route("/")
  .get(listingController.index)
  // .post(isLoggedIn, listingController.createListing)
  .post(isLoggedIn, upload.single("image"), listingController.createListing);

// /new → must be BEFORE /:id
router.get("/new", isLoggedIn, listingController.renderNewForm);

// /:id → show, update, delete
router.route("/:id")
   .get(listingController.showListing)
   .put(isLoggedIn, isOwner, upload.single("image"), listingController.updateListing)
   .delete(isLoggedIn, isOwner, listingController.destroyListing);

// /:id/edit → edit form
router.get("/:id/edit", isLoggedIn, isOwner, listingController.editListing);

module.exports = router;