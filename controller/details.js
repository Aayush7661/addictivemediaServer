const personalDetails = require("../models/personalDetails");
const useragent = require("useragent");
const addPersonalDetails = async (req, res) => {
  try {
    const { firstName, lastName, birthDetails, number, email } = req.body;
    if (!firstName || !lastName || !birthDetails || !email || !number) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Please provide valid data",
      });
    }
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!phoneRegex.test(number) || !emailRegex.test(email)) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Invalid Phone Number or Email Address",
      });
    }
    const existingDetails = await personalDetails.findOne({
      $or: [{ number }, { email }],
    });
    if (!existingDetails) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Phone Number or Email Address already exists",
      });
    }
    const agent = useragent.parse(req.headers["user-agent"]);
    let browsername = agent.family;
    const newPersonalDetails = new personalDetails({
      ip: req.connection.remoteAddress || null,
      deviceType: req.device.type || null,
      browser: browsername || null,
      userAgent: req.headers["user-agent"] || null,
      firstName,
      lastName,
      "birthDetails.day": birthDetails.day,
      "birthDetails.month": birthDetails.month,
      "birthDetails.year": birthDetails.year,
      number,
      email,
    });
    await newPersonalDetails.save();
    let userFinalDetails = await personalDetails.findOne({ number });
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User details saved successfully",
      data: userFinalDetails,
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "failure",
      message: err.toString(),
    });
  }
};

const previousAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const {previousAddress} = req.body;
    if (!id || !Array.isArray(previousAddress)) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Please provide valid data",
      });
    }
    let existingDetails= await personalDetails.findOne({_id:id});
    if (!existingDetails) {
      return res.status(400).json({
        statusCode: 400,
        status: "failure",
        message: "Personal detaials not found",
      });
    }
    existingDetails.previousAddress = previousAddress;
    await existingDetails.save();
    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User details saved successfully",
    });
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      status: "failure",
      message: err.toString(),
    });
  }
};
module.exports = { addPersonalDetails, previousAddress };
