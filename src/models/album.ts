import { Schema, model } from "mongoose";
import { IAlbum } from "../types";

const AlbumSchema = new Schema<IAlbum>({
  artists: [{ type: Schema.Types.ObjectId, ref: "Artists", required: true }],
  name: { type: String, required: true, unique: true },
  releaseDate: Date,
  lastPlayed: Date,
  imageFilename: String,
});

export const Album = model<IAlbum>("Album", AlbumSchema);
