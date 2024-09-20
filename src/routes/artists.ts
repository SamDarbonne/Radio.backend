import express from "express";
import { getArtists, getArtistById } from "../controllers/artistController";

const router = express.Router();

router.get("/", getArtists);
router.get("/:id", getArtistById);

export default router;
