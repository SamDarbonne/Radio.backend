import { Request, Response } from "express";
import { Song } from "../models/song";
import { processSongs } from "../utils/fileHandler";
import { playSong } from "../utils/mediaPlayer";
import { Album } from "../models/album";

export const getSongs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const songs = await Song.find({})
    .populate({ path: "artists", select: "name" })
    .populate({ path: "album", select: { name: 1, imageFilename: 1 } })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalDocuments = await Song.countDocuments();

  res.json({ documents: songs, totalPages: Math.ceil(totalDocuments / limit) });
};

export const getSong = async (req: Request, res: Response) => {
  const song = await Song.findById(req.params.id);
  res.json(song);
};

export const createSongs = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const songsData = await processSongs(files);

  const songs = await Song.insertMany(songsData);

  const albumUpdates = songs
    .filter((song) => song.album)
    .map(async (song) => {
      await Album.findByIdAndUpdate(
        song.album,
        { $addToSet: { songs: song._id } },
        { new: true, useFindAndModify: false }
      );
    });
  console.log({ albumUpdates });
  const updatedAlbums = await Promise.all(albumUpdates);
  console.log({ updatedAlbums });
  res.json(songs);
};

export const updateSong = async (req: Request, res: Response) => {
  const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(song);
};

export const deleteSongs = async (req: Request, res: Response) => {
  const ids = req.body.ids || [req.params.id];
  await Song.deleteMany({ _id: { $in: ids } });
  res.json({ message: "Songs deleted" });
};

export const playSongById = async (req: Request, res: Response) => {
  console.log("playSongById");
  const song = await Song.findById(req.params.id);
  if (song) {
    playSong(song.filepath);
    res.json({ message: "Playing song" });
  } else {
    res.status(404).json({ message: "Song not found" });
  }
};
