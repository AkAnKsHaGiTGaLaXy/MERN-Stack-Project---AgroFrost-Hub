const express = require("express");
const ColdStorageOwnerController = require("../controller/ColdStorageOwnerController");

const router = express.Router();

router.use("/owner", ColdStorageOwnerController);

module.exports = router;
