import express from "express";
import {
  getPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
} from "../controllers/playlistController";

const router = express.Router();

router.get("/", getPlaylists);
router.get("/:id", getPlaylist);
router.post("/", createPlaylist);
router.put("/:id", updatePlaylist);
router.post("/:id/song", addSongToPlaylist);
router.delete("/:id", deletePlaylist);

export default router;
