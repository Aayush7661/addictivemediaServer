const dotenv =require('dotenv')
dotenv.config({ path: "./.env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const {authRouter} = require("./routes/auth.js")
const {detailsRouter} = require("./routes/details.js")
const device = require('express-device');
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected!");
  });

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(device.capture());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/token", authRouter);
app.use("/api/v1/details",detailsRouter)
// app.use("/user",);

const port = process.env.PORT || 8050;

app.listen(port, () => console.log(`Server started on port ${port}`));
