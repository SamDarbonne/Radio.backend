import { Document, ObjectId } from "mongoose";

export interface IArtist extends Document {
  name: string;
  pseudonyms?: string[];
  albums: ObjectId[];
  dateAdded: Date;
}

export interface IAlbum extends Document {
  name: string;
  artists: ObjectId[];
  releaseDate: Date;
  lastPlayed?: Date;
  imageFilename?: string;
}

export interface ISong extends Document {
  dateAdded: Date;
  filepath: string;
  playedTimes: Date[];
  theme?: ObjectId;
  duration: number;
  artists: ObjectId[];
  album?: ObjectId;
  name: string;
  track?: {
    no: number;
    of?: number;
  };
}

export interface IPlaylist extends Document {
  imageFilename?: string;
  songs: ObjectId[];
  name: string;
  description?: string;
  theme?: ObjectId;
}

export interface ITheme extends Document {
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  iconFilename?: string;
}
