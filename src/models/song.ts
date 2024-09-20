import { Schema, model } from "mongoose";
import { ISong } from "../types";

const SongSchema = new Schema<ISong>({
  dateAdded: { type: Date, default: Date.now },
  filepath: { type: String, required: true },
  playedTimes: { type: [Date], index: true },
  theme: { type: Schema.Types.ObjectId, ref: "Theme" },
  duration: { type: Number, required: true },
  artists: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
  album: { type: Schema.Types.ObjectId, ref: "Album" },
  name: { type: String, required: true },
  track: {
    no: Number,
    of: Number,
  },
});

export const Song = model<ISong>("Song", SongSchema);
