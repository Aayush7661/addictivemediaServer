const jwt = require("jsonwebtoken");
const tokenData = require("../models/token.js");

const authMiddleware = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (token) {
    try {
      let JWT_SECRET = process.env.JWT_SECRET;
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!decoded) {
        return res.status(400).json({
          statusCode: 400,
          status: "failure",
          message: "Unauthorized",
        });
      }
      let data = await tokenData.findOne({
        token: token,
        deviceId: decoded.info.deviceId,
      });
      if (!data) {
        return res.status(400).json({
          statusCode: 400,
          status: "failure",
          message: "Unauthorized",
        });
      }
    } catch (err) {
      return res.status(401).json({
        statusCode: 401,
        status: "failure",
        message: err.toString(),
      });
    }
  }
  next();
};

const generateAuthToken = async (req, res) => {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Fids / Id are required",
      });
    }
    let JWT_SECRET = process.env.JWT_SECRET;
    token = jwt.sign(
      {
        info: {
          deviceId: deviceId,
        },
        date: Date.now(),
      },
      JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );
    let query = { deviceId: deviceId };
    let data = await tokenData.findOne(query);
    if (data) {
      data.token = token;
      await data.save();
    } else {
      await tokenData.create({
        token: token,
        deviceId: deviceId ? deviceId : "",
      });
    }
    res.status(200).json({
      statusCode: 200,
      token: token,
      status: "success",
      message: "Token Generated Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      statusCode: 401,
      status: "failure",
      message: err.toString(),
    });
  }
};
module.exports = { authMiddleware, generateAuthToken };
