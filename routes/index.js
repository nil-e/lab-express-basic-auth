const router = require("express").Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  console.log('The form data: ', req.body);
   const { username, password } = req.body;
  console.log('username', username, 'pwd', password);
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    return User.create({
      username,
      password: hashedPassword
    });
  })
  .then(userFromDB => {
    console.log('Newly created user is: ', userFromDB);
    res.redirect('/userProfile');
})
  .catch(error => next(error));
});

router.get("/userprofile", (req, res, next) => {
  res.render("users/userprofile");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", (req, res, next) => {
  console.log('The form data: ', req.body);
   const { username, password } = req.body;
  console.log('username', username, 'pwd', password);
  bcryptjs
  .genSalt(saltRounds)
  .then(salt => bcryptjs.hash(password, salt))
  .then(hashedPassword => {
    let userFound = User.find({
      username: username,
      passwordHash: hashedPassword
    });
    return console.log(userFound);
  })
  .then(userFromDB => {
    console.log('We can log in:', userFromDB);
    res.redirect('/userProfile');
})
  .catch(error => next(error));
});

module.exports = router;
