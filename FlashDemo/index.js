// Config the App
const express = require("express");
const app = express();
const path = require("path");
// npm i mongoose
const mongoose = require("mongoose");
// npm i express-session
const session = require("express-session");
// npm i connect-flash
const flash = require("connect-flash");

// Config the secret key of the express session, and remove the messages that show up when we start the application
const sessionOptions = {
  secret: "thisisnotagoodsecret",
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOptions));
app.use(flash());

const Farm = require("./models/farm");

mongoose
  .connect("mongodb://localhost:27017/flashDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

// FARM ROUTES

app.use((req, res, next) => {
  res.locals.messages = req.flash("success");
  next();
});

app.get("/farms", async (req, res) => {
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});
app.get("/farms/new", (req, res) => {
  res.render("farms/new");
});
app.get("/farms/:id", async (req, res) => {
  const farm = await Farm.findById(req.params.id).populate("products");
  res.render("farms/show", { farm });
});

app.post("/farms", async (req, res) => {
  const farm = new Farm(req.body);
  await farm.save();
  //   We insert a keyvalue, then a message to flash when the user hits this route and submit a new Farm
  //   This is the first step, the second step according to the docs, we need to pass the flash when we render something, in this case
  //   The user after submit will be redirect to the farms view, so we need to config the render too
  req.flash("success", "Successfully made a new farm!");
  res.redirect("/farms");

  // Another tjimg
});

app.listen(3000, () => {
  console.log("APP IS LISTENING ON PORT 3000!");
});
