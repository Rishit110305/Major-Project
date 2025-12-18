const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/list.js");

// Connect to MongoDB
main()
  .then(() => console.log("connection successful!"))
  .catch((err) => console.log("Connection error:", err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB = async () => {
    await Listing.deleteMany({});

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "6918d458e812d28b9adbd084"
    }));

    await Listing.insertMany(initData.data);
    console.log("data was initialised !");
};

initDB();
