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
      app        = express(),
      PORT       = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hello");
});

//INDEX ROUTE
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//NEW ROUTE
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//CREATE ROUTE
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  if (!longURL) {
    return res.send("I know what you did last summer!")
  }
  res.redirect(longURL);
});

app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id;
  console.log(urlDatabase[urlID])
  delete urlDatabase[urlID];
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});