const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
//dotenv.config();  - not required when installing the dotenv npm package, you can save it as a dev dependency like this npm install dotenv --save-dev

const whitelist = [
  "http://localhost:5173",
  "https://staging.yoursite.com",
  "https://money-transfer-here.netlify.app"
];

// server.js
const port = process.env.PORT || 3000;
// console.log(`Your port is ${port}`);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true); // allow non-browser requests
    } else if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // important to allow cookies/auth
};

app.use(cors(corsOptions)); // <-- Use only this, remove other cors middleware calls
app.use(express.json());

// Your routes
const mainRouter = require("./routes/index.js");
app.use("/api/v1", mainRouter);
app.get("/health", (req, res) => {
  res.send("Route is Healthy"); }
);


app.listen(port, () => console.log(`Server running on port ${port}`));
