import express from "express";
import { upload } from "../utils/fileHandler";
import {
  getSongs,
  getSong,
  createSongs,
  updateSong,
  deleteSongs,
  playSongById,
} from "../controllers/songController";

const router = express.Router();

router.get("/", getSongs); // Get all songs (paginated)
router.get("/:id", getSong); // Get individual song
router.post("/", upload.array("files"), createSongs); // Upload songs
router.put("/:id", updateSong); // Update song
router.delete("/:id", deleteSongs); // Delete individual song
router.delete("/", deleteSongs); // Delete multiple songs
router.post("/:id/play", playSongById); // Play song

export default router;
