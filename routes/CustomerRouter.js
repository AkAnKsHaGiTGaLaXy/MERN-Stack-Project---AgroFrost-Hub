const express = require("express");
const CustomerController = require("../controller/CustomerController");

const router = express.Router();

router.use("/user", CustomerController);

module.exports = router;
