import { Schema, model } from "mongoose";
import { IAlbum } from "../types";

const AlbumSchema = new Schema<IAlbum>({
  artists: [{ type: Schema.Types.ObjectId, ref: "Artists", required: true }],
  name: { type: String, required: true, unique: true },
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  releaseDate: Date,
  lastPlayed: Date,
  imageFilename: String,
});

export const Album = model<IAlbum>("Album", AlbumSchema);
