const express = require("express");
const AdminController = require("../controller/AdminController");

const router = express.Router();

router.use("/admin", AdminController);

module.exports = router;
