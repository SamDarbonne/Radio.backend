import express from "express";
import { getAlbumsByArtist } from "../controllers/albumController";

const router = express.Router();

router.get("/artist/:id", getAlbumsByArtist);

export default router;
