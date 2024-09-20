import { Schema, model } from "mongoose";
import { IArtist } from "../types";

const ArtistSchema = new Schema<IArtist>({
  name: { type: String, required: true },
  pseudonyms: [String],
  albums: [{ type: Schema.Types.ObjectId, ref: "Album" }],
  dateAdded: { type: Date, default: Date.now },
});

export const Artist = model<IArtist>("Artist", ArtistSchema);
