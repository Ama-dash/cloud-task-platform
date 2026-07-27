//Import Express
const express = require("express");

//Create Router

const router = express.Router();

//Import Controller
const { register, login } = require("../controllers/authController");

//Create Register API Route
router.post("/register", register);

//create login API route
router.post("/login", login);

//Export Router
module.exports = router;