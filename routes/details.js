const express = require("express");
const { authMiddleware } = require("../middlewares/auth.js");
const { addPersonalDetails, previousAddress } = require("../controller/details.js");

const detailsRouter = express.Router();

detailsRouter.post("/personl-details", authMiddleware, addPersonalDetails);
detailsRouter.post("/previous-address/:id", authMiddleware, previousAddress)
module.exports = { detailsRouter };
