const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
let jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_TOKEN = process.env.JWT_TOKEN;
const bodyParser = require("body-parser");
let localStorage = require('local-storage');

//Default route/home page
router.get("/", async (req, res) => {
  res.send("Hello World");
});

//New User signup
router.post(
  "/signup",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password should be of minimum length 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let newUser = req.body;
    const salt = await bcrypt.genSaltSync(10);
    let hash = await bcrypt.hashSync(newUser.password, salt);
    try {
      let user = new User({
        email: newUser.email,
        password: hash,
      });
      user = await user.save();
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_TOKEN);
      const temp = localStorage.get("token");
      if(temp==authtoken) res.redirect("http://localhost:3006/app");
      else res.redirect("http://localhost:3006/user");
    } catch (error) {
      res.status(500).send("Error while saving user: " + error.message);
    }
  }
);

// /New User login
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password can't be blank").exists({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ error: "Wrong credentials" });
      let pass = await bcrypt.compare(password, user.password);
      if (pass) {
        const data = {
          user: {
            id: user.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_TOKEN);
        localStorage.set('token',authtoken);
        console.log(localStorage.get("token"));
        res.redirect("http://localhost:3006/app");
      } else {
        return res.status(400).json({ error: "Wrong credentials" });
      }
    } catch (error) {
      res.status(500).send("Error while logging in user: " + error.message);
    }
  }
);

module.exports = router;