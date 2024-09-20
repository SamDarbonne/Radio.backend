import { Schema, model } from "mongoose";
import { IPlaylist } from "../types";

const PlaylistSchema = new Schema<IPlaylist>({
  imageFilename: String,
  songs: [{ type: Schema.Types.ObjectId, ref: "Song" }],
  name: { type: String, required: true },
  description: String,
  theme: { type: Schema.Types.ObjectId, ref: "Theme" },
});

export const Playlist = model<IPlaylist>("Playlist", PlaylistSchema);
