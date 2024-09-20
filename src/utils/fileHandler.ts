import multer from "multer";
import path from "path";
import fs from "fs-extra";
import { loadMusicMetadata } from "music-metadata";
import sharp from "sharp";
import { ISong, IArtist, IAlbum } from "../types";
import { Artist } from "../models/artist";
import { Album } from "../models/album";
import { ObjectId } from "mongoose";

const mediaDir = path.join(__dirname, "../../media");
const imagesDir = path.join(__dirname, "../../images");

fs.ensureDirSync(mediaDir);
fs.ensureDirSync(imagesDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, mediaDir);
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage });

export const processSongs = async (files: Express.Multer.File[]) => {
  const songsData: Partial<ISong>[] = [];
  const mm = await loadMusicMetadata();

  for (const file of files) {
    const metadata = await mm.parseFile(file.path);
    const common = metadata.common;

    // Handle artists
    const artistNames = common.artist
      ? common.artist.split(",")
      : ["Unknown Artist"];
    const artistIds: ObjectId[] = (await Promise.all(
      artistNames.map(async (name) => {
        const artistName = name.trim();
        let artist: IArtist | null = await Artist.findOne({ name: artistName });
        if (!artist) {
          try {
            artist = new Artist({ name: artistName, albums: [] });
            await artist.save();
          } catch (error: any) {
            if (error.code === 11000) {
              artist = await Artist.findOne({ name: artistName });
            } else {
              throw error;
            }
          }
        }
        return artist!._id;
      })
    )) as ObjectId[];

    // Handle album
    let albumId: ObjectId | undefined = undefined;
    if (common.album) {
      const albumName = common.album.trim();
      let album: IAlbum | null = await Album.findOne({ name: albumName });
      if (!album) {
        try {
          album = new Album({ name: albumName, artist: artistIds[0] });
          await album.save();

          // Save album image
          if (common.picture && common.picture.length > 0) {
            const image = common.picture[0];
            const imagePath = path.join("images", `${album._id}.jpg`);

            // Check if the image file already exists
            if (!fs.existsSync(imagePath)) {
              fs.writeFileSync(imagePath, image.data);
              album.imageFilename = `${album._id}.jpg`;
              await album.save();
            }
          }
        } catch (error: any) {
          if (error.code === 11000) {
            album = await Album.findOne({ name: albumName });
          } else {
            throw error;
          }
        }
      }
      albumId = album!._id as ObjectId;
    }

    const songData: Partial<ISong> = {
      name: common.title || file.originalname,
      filepath: file.path,
      duration: metadata.format.duration || 0,
      artists: artistIds,
      album: albumId,
      track: common!.track as { no: number; of: number },
    };

    songsData.push(songData);
  }

  return songsData;
};
