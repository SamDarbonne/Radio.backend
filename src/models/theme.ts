import { Schema, model } from "mongoose";
import { ITheme } from "../types";

const ThemeSchema = new Schema<ITheme>({
  color1: { type: String, required: true },
  color2: { type: String, required: true },
  color3: { type: String, required: true },
  color4: { type: String, required: true },
  iconFilename: String,
});

export const Theme = model<ITheme>("Theme", ThemeSchema);
