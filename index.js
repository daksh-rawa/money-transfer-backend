const express = require("express");
const cors = require("cors");
const app = express();

const whitelist = [
  "http://localhost:5173",
  "https://staging.yoursite.com",
  "https://yourproductiondomain.com"
];

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


app.listen(3000, () => console.log("Server running on port 3000"));
