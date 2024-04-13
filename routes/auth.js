const express = require('express');
const {generateAuthToken} = require("../middlewares/auth")

const authRouter = express.Router();

authRouter.post("/generate-token", generateAuthToken);

module.exports =  { authRouter };
