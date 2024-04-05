const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);
  const { username, password } = req.body;
  console.log("username", username, "pwd", password);
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/userProfile");
    })
    .catch((error) => next(error));
});

router.get("/userprofile", (req, res, next) => {
  res.render('users/user-profile', 
  { userInSession: req.session.currentUser });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log("SESSION =====> ", req.session);
  const { username, password } = req.body;
  console.log({ username, password });
  User.findOne({ username: username })
    .then((userFromDB) => {
      if (!userFromDB) {
        throw new Error("User not found");
      } 
      else if (bcryptjs.compare(password, userFromDB.password)) {
        console.log("Login successful");
        req.session.currentUser = userFromDB;
        res.redirect("/userProfile");
      } else {
        throw new Error("Invalid password");
      }
    })
    .catch((error) => next(error));
});

//might need a review
router.post('/logout', (req, res, next) => {
  req.session.destroy(err => {
    if (err) next(err);
    res.redirect('/');
  });
});

module.exports = router;
