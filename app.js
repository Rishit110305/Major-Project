if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const port = 8080;

// Connect to MongoDB
main()
  .then(() => console.log("connection successful!"))
  .catch((err) => console.log("Connection error:", err));

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
}

app.set("view engine", "ejs"); //ejs
app.set("views", path.join(__dirname, "views")); // for views folder

app.use(express.static(path.join(__dirname, "public"))); // public dir
app.use(express.urlencoded({extended : true})); // to parse the info for post req
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
  mongoUrl : process.env.ATLASDB_URL,
  secret : process.env.SESSION_SECRET,
  touchAfter: 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = { // for express session
    store, // mongoStore 
    secret :process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 1000 for ms 
      maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly : true,
    }
}

// Home Route
// app.get("/", (req, res) => {
//     res.send("Hello, I'm a carrot !");
// });

app.use(session(sessionOptions));
app.use(flash());

// Set up for Passport
app.use(passport.initialize()); // initialize the passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currUser = req.user;     // who is logged in
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  next();
});




// listing Routes
app.use("/listings", listingRouter);

// Reviews Routes
app.use("/listings/:id/reviews", reviewRouter);

// User Route 
app.use("/", userRouter);

// 404 handler (for all unmatched routes)
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let {status=500, message="something went wrong !"} = err;
  res.status(status).render("error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(8080, () => {
    console.log(`server is listening to port ${port}`);
});






// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student" // without having username in schema we can add in it 
//   });

//   let registeredUser = await User.register(fakeUser, "helloworld"); // imp 
//   res.send(registeredUser);
// });




// Testing DB
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title : "My new Villa",
//     description : "By the Beach",
//     price : 12000000,
//     location : "Calungute , Goa",
//     country : "India"
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull testing ");
// });





