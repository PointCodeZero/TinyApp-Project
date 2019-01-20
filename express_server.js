const express      = require("express"),
      bodyParser   = require("body-parser"),
      cookieSession = require("cookie-session"),
      bcrypt       = require('bcrypt'),
      app          = express(),
      PORT         = 8080;


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))


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


function generateRandomString() {
  let shortURL = "";
  let char = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 6; i++) {
     shortURL += char.charAt(Math.floor(Math.random() * char.length));
   }
   return shortURL;
}


//ROOT ROUTE
app.get("/", (req, res) => {
  res.send("Hello");
});


//INDEX ROUTE
app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase[req.session.user_id],
    user: users[`${req.session.user_id}`]
  };
  res.render("urls_index", templateVars);
});


//NEW ROUTE
app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[`${req.session.user_id}`] };
  if (req.session.user_id) {
    return res.render("urls_new", templateVars);
  }
  res.redirect("/login");
});


//CREATE ROUTE
app.post("/urls", (req, res) => {
  let randomString = generateRandomString();
  if (!urlDatabase[req.session.user_id]) {
    urlDatabase[req.session.user_id] = {}
  }
  urlDatabase[req.session.user_id][randomString] = req.body.longURL;
  res.redirect(`/urls/${randomString}`);
});


//SHOW ROUTE
app.get("/urls/:id", (req, res) => {
  let templateVars = {
    shortURL: req.params.id, urls: urlDatabase[req.session.user_id],
    user: users[`${req.session.user_id}`]
  };
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  if(!urlDatabase[req.session.user_id][req.params.id]) {
    return res.send("This short URL does not belong to you! Shame on YOU!!!!");
  }

  //improvement - rigth function to loop and check URLs

  res.render("urls_show", templateVars);
});


//EDIT + UPDATE ROUTE
app.get("/u/:shortURL", (req, res) => {
  for (let userId in urlDatabase) {
    for(let shortURL in urlDatabase[userId]) {
      if (shortURL === req.params.shortURL) {
        return res.redirect(urlDatabase[userId][shortURL]);
      }
    }
  }
  return res.send("This short URL does not exist!");
});

app.post("/urls/:id", (req, res) => {
  const urlID = req.params.id;
  if (req.session.user_id) {
    urlDatabase[req.session.user_id][urlID] = req.body.longURL;
    return res.redirect("/urls");
  }
  res.redirect("/login");
});


//DELETE ROUTE
app.post("/urls/:id/delete", (req, res) => {
  const urlID = req.params.id;
  if (req.session.user_id) {
    delete urlDatabase[req.session.user_id][urlID];
    return res.redirect("/urls");
  }
  res.redirect("/login");
});


//LOGIN ROUTE
app.get("/login", (req, res) => {
  res.render("login", { user: req.session.user_id });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  for(let user in users){
    if (email === users[user].email && bcrypt.compareSync(password, users[user].password)) {
      // res.session("user_id", users[user].id);
      req.session.user_id = users[user].id;
      return res.redirect("/urls");
    }
  }
  res.status(403).send("BEGONE YOUR HACKER!!!!!");
});


//LOGOUT ROUTE
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});


//REGISTER ROUTE
app.get("/register", (req, res) => {
  res.render("register", { user: req.cookie });
});

app.post("/register", (req, res) => {
  const newID = generateRandomString();
  const newEmail = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  if (!newEmail || !password) {
    return res.status(400).send("Please provide an email and password");
  }
  for(let user in users) {
    if (newEmail === users[user].email) {
      return res.status(409).send("Sorry, this e-mail is already registered. Please try another one!");
    }
  }
  users[newID] = {
    id: newID,
    email: newEmail,
    password: hashedPassword,
  };
  req.session.user_id = newID;
  res.redirect("/urls");
});


//PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

