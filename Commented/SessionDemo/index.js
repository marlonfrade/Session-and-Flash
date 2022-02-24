// Configuring the App
const express = require("express");
const app = express();
const port = 3000;

// npm i express-session
const session = require("express-session");

// Creating a middleware to set up by the documentation of npm express-session
// In this case we'll use the secret key to validate our information on send to the server
// app.use(session({ secret: "secret" }));
const sessionOpt = {
  secret: "secret",
  //   This two params below are to fix the message when you start the application using express-session
  resave: false,
  saveUninitialized: false,
};
app.use(session(sessionOpt));

app.get("/viewcount", (req, res) => {
  // Verifying
  //   res.send("You Have Viewed this Page X times");
  // making the logic
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`You Viewed this page ${req.session.count} times`);
  //   To test it, go to the path, then the number should be increment every time you refresh the page.
  //   You can test on the postman too, by sending a GET request to the localhost and the path of this function
});
// Warning The default server-side session storage, MemoryStore, is purposely not designed for a production environment. It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.

app.get("/register", (req, res) => {
  // We destructuring the username to take it off of the query string, and use it in others functions, then we set a value pattern in case there's not a query string to get.
  const { username = "anonymous" } = req.query;
  req.session.username = username;
  res.redirect("/greet");
});

app.get("/greet", (req, res) => {
  const { username } = req.session;
  res.send(`Hey There, welcome back ${username}`);
});

// To test it, if we go straight to /greet, It'll not work, but if we go first to /register, and not set a value on query string to username, we'll receive by pattern the Anonymous value
// But if we set a value to username query string, the test must be work when you redirect to /greet

app.listen(port, () => {
  console.log(`APP is listening on port ${port}`);
});
