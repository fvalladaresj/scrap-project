require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

app.use(express.json());

const basicAuth = require("basic-auth");
app.use((req, res, next) => {
  const user = basicAuth(req);
  if (
    !user ||
    user.name !== process.env.AUTH_USER ||
    user.pass !== process.env.AUTH_PASSWORD
  ) {
    res.status(401).send("Authentication failed.");
    return;
  }
  // User is authenticated, proceed to the next middleware or route handler
  next();
});

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});

const routes = require("./routes/routes");

app.use("/api", routes);
