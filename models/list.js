// models/list.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
   title: {
    type: String,
    required: true 
  },
  description: {
    type: String,
    required: true 
  },
  price: {
    type: Number,
    required: true 
  },
  location: {
    type: String,
    required: true 
  },
  country: {
    type: String,
    required: true 
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  image: {
    url: String,
    filename: String
  },
  geometry: {
    // GeoJSON
    type: {
      type: String,
      enum: ["Point"],
      required: false // allow false if you want optional — but recommended true when geocoded
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: false
    }
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

module.exports = mongoose.model("Listing", ListingSchema);
