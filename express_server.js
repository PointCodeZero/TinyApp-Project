function generateRandomString() {
  let shortURL = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < 6; i++) {
     shortURL += char.charAt(Math.floor(Math.random() * char.length));
   }
   return shortURL;
}

// function userForId(shortURL) {
// let test = urlDatabase[req.cookies.user_id];
//   if (test === shortURL) {
//     return res.send("This is not your URL");
//   }
// }

const express    = require("express"),
      bodyParser = require("body-parser"),
      cookieParser = require("cookie-parser"),
      app        = express(),
      PORT       = 8080;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "f01": {
    "b2xVn2": "http://www.lighthouselabs.ca"
    },
  "f02": {
    "9sm5xK": "http://www.google.com"
  }
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
  let templateVars = { urls: urlDatabase[req.cookies.user_id], user: users[`${req.cookies.user_id}`] };
  res.render("urls_index", templateVars);
});

//NEW ROUTE
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[`${req.cookies.user_id}`] };
  if (req.cookies.user_id) {
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});

//CREATE ROUTE
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  urlDatabase[req.cookies.user_id][randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});

//SHOW ROUTE
app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, urls: urlDatabase[req.cookies.user_id], user: users[`${req.cookies.user_id}`] };
  if (!req.cookies.user_id) {
    return res.redirect("/login");
  }

  if(req.cookies.user_id !== urlDatabase[req.cookies.user_id].id) {
    return res.send("This short URL does not belong to you! Shame on YOU!!!!");
  }

  res.render("urls_show", templateVars);
});

//EDIT + UPDATE ROUTE
app.get("/u/:shortURL", (req, res) => {

  for (var userId in urlDatabase) {
    for(var shortURL in urlDatabase[userId]) {
      if (shortURL === req.params.shortURL) {
        return res.redirect(urlDatabase[userId][shortURL]);
      }
    }
  }
  return res.send("This short URL does not exist!");
});

app.post("/urls/:id", (req, res) => {
  const urlID = req.params.id;
  if (req.cookies.user_id) {
    urlDatabase[req.cookies.user_id][urlID] = req.body.longURL;
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

//DELETE ROUTE
app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id;
  if (req.cookies.user_id) {
    delete urlDatabase[urlID];
    return res.redirect("/urls");
  }
  res.redirect("/login");
});

//LOGIN ROUTE
app.get("/login", (req, res) => {
  res.render("login", { user: req.cookie });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for(let user in users){
    if (email === users[user].email && password === users[user].password) {
      res.cookie("user_id", users[user].id);
      return res.redirect("/urls");
    }
  }
  res.status(403).send("BEGONE!");
});

//LOGOUT ROUTE
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//REGISTER ROUTE
app.get("/register", (req, res) => {
  res.render("register", { user: req.cookie });
});

app.post("/register", (req, res) => {
  const newID = generateRandomString();
  const newEmail = req.body.email;
  const newPassword = req.body.password;
  if (!newEmail || !newPassword) {
    return res.status(400).send("Please provide an email and password");
  }
  users[newID] = {
    id: newID,
    email: newEmail,
    password: newPassword
  };
  res.cookie("user_id", newID);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

