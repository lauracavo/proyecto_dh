const express = require("express");
const route = express.Router();
const mainController = require("../controllers/mainController");
const authMiddleware = require("../middlewares/authMiddleware");

route.get("/", mainController.home);
route.get("/aboutUs", mainController.aboutUs);


module.exports = route;
