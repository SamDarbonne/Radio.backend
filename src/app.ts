import express from "express";
import mongoose from "mongoose";
import songRoutes from "./routes/songs";
import artistRoutes from "./routes/artists";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/songs", songRoutes);
app.use("/artists", artistRoutes);
// app.use('/albums', albumRoutes);
// app.use('/playlists', playlistRoutes);
// app.use('/themes', themeRoutes);

export default app;
