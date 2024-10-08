import express from "express";
import songRoutes from "./routes/songs";
import artistRoutes from "./routes/artists";
import albumRoutes from "./routes/albums";
import playlistRoutes from "./routes/playlists";
import cors from "cors";
import path from "path";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "..", "images")));

app.use("/songs", songRoutes);
app.use("/artists", artistRoutes);
app.use("/albums", albumRoutes);
app.use("/playlists", playlistRoutes);
// app.use('/themes', themeRoutes);

export default app;
