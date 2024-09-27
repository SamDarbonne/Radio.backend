import app from "./app";

const PORT = process.env.PORT || 4000;
const DB = process.env.DB || "musicdb";

import mongoose from "mongoose";

mongoose
  .connect(`mongodb://localhost:27017/${DB}`, {})
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });
