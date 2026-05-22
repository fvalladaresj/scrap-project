import 'dotenv/config';

import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import basicAuth from "basic-auth";
import routes from "./routes/routes.js"

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
app.use(cors());

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

app.use("/api", routes);
