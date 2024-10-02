import app from "./app";

const PORT = process.env.PORT || 4000;
const DB = process.env.DB || "musicdb";

import mongoose from "mongoose";
const connectionString = `mongodb://localhost:27017/${DB}`;

mongoose
  .connect(connectionString, {})
  .then(() => {
    console.log(`Connected to MongoDB at ${connectionString}`);
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
