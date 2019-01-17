function generateRandomString() {
  let shortURL = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
     shortURL += char.charAt(Math.floor(Math.random() * char.length));
   }
   return shortURL;
}

const express    = require("express"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      app        = express(),
      PORT       = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "f01": {
    id: "f01",
    email: "mike@gmail.com",
    password: "meow"
  },
 "f02": {
    id: "f02",
    email: "andreia@gmail.com",
    password: "deia"
  }
}

//ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hello");
});

//INDEX ROUTE
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, username: req.cookies.username };
  res.render("urls_index", templateVars);
});

//NEW ROUTE
app.get("/urls/new", (req, res) => {
  res.render("urls_new", { username: req.cookie });
});

//CREATE ROUTE
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

//SHOW ROUTE
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase, username: req.cookies.username };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (!longURL) {
    return res.send("I know what you did last summer!")
  }
  res.redirect(longURL);
});

//EDIT + UPDATE ROUTE
app.post("/urls/:id", (req, res) => {
  const urlID = req.params.id;
  urlDatabase[urlID] = req.body.longURL;
  res.redirect("/urls");
});

//DELETE ROUTE
app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id;
  delete urlDatabase[urlID];
  res.redirect("/urls");
});

//LOGIN ROUTE
app.post("/login", (req, res) => {
  res.cookie("username", req.body.username);
  res.redirect("/urls");
});

//LOGOUT ROUTE
app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect("/urls");
});

//REGISTER ROUTE
app.get("/register", (req, res) => {
  res.render("register", { username: req.cookie });
});

app.post("/register", (req, res) => {
  const userID = generateRandomString();
  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password
  };
  res.cookie("user_id", userID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

