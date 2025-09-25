const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
//dotenv.config();  - not required when installing the dotenv npm package, you can save it as a dev dependency like this npm install dotenv --save-dev

// Allow all origins by reflecting the request origin

// server.js
const port = process.env.PORT || 3000;
// console.log(`Your port is ${port}`);

const corsOptions = {
  origin: true, // reflect request origin
  credentials: true
};

app.use(cors(corsOptions)); // <-- Use only this, remove other cors middleware calls
app.options("*", cors(corsOptions)); // enable preflight for all routes
app.use(express.json());

// Your routes
const mainRouter = require("./routes/index.js");
app.use("/api/v1", mainRouter);
app.get("/health", (req, res) => {
  res.send("Route is Healthy"); }
);


app.listen(port, () => console.log(`Server running on port ${port}`));
