import { Request, Response } from "express";
import { Playlist } from "../models/playlist";
import { Types } from "mongoose";

const findUniqueName = async (name: string, model: any) => {
  let newName = name;
  let index = 1;
  while (await model.findOne({ name: `${newName}-${index}` })) {
    index++;
  }
  return `${newName}-${index}`;
};

export const getPlaylists = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const playlists = await Playlist.find({})
    .populate({
      path: "songs",
      select: "name",
      populate: { path: "artists", select: { name: 1, _id: 1 } },
    })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalDocuments = await Playlist.countDocuments();

  res.json({
    documents: playlists,
    totalPages: Math.ceil(totalDocuments / limit),
  });
};

export const getPlaylist = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const { id } = req.params;

  if (!id || id === "undefined") {
    res.status(404).json({ message: "Playlist not found" });
  }

  const playlistAggregation = await Playlist.aggregate([
    { $match: { _id: new Types.ObjectId(id) } }, // Match the playlist by ID
    {
      $project: {
        name: 1,
        _id: 1,
        songs: { $slice: ["$songs", skip, limit] }, // Paginate the songs array
      },
    },
  ]);

  if (!playlistAggregation || playlistAggregation.length === 0) {
    return res.status(404).json({ message: "Playlist not found" });
  }

  const playlist = playlistAggregation[0];
  const populatedPlaylist = await Playlist.populate(playlist, {
    path: "songs",
    select: { name: 1, _id: 1, artists: 1, album: 1, duration: 1 },
    populate: { path: "artists", select: { name: 1, _id: 1 } },
  });

  console.log({ populatedPlaylist });

  const totalSongsAggregation = await Playlist.aggregate([
    { $match: { _id: new Types.ObjectId(id) } },
    { $project: { totalSongs: { $size: "$songs" } } },
  ]);

  console.log({ totalSongsAggregation });

  const totalPages = Math.ceil(totalSongsAggregation[0].totalSongs / limit);

  const responseObject = {
    page,
    name: populatedPlaylist!.name,
    _id: populatedPlaylist!._id!.toString(),
    documents: populatedPlaylist!.songs,
    totalPages,
  };
  res.json(responseObject);
};

export const createPlaylist = async (req: Request, res: Response) => {
  const body = req.body || {};
  if (body.name) {
    try {
      const playlist = await Playlist.create(body);
      res.json(playlist);
    } catch (error) {
      const newName = await findUniqueName(body.name, Playlist);
      const playlist = await Playlist.create({ ...body, name: newName });
      res.json(playlist);
    }
  } else {
    const newName = await findUniqueName("New Playlist", Playlist);
    const playlist = await Playlist.create({ ...body, name: newName });
    res.json(playlist);
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const { songs, page } = req.body;
  console.log({ songs, page });
  const playlist = await Playlist.findById(req.params.id);
  if (songs) {
    playlist!.songs = [...songs, ...playlist!.songs.slice((page + 1) * 100)];
  }
  await playlist!.save();
  res.json(playlist);
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  const playlist = await Playlist.findByIdAndUpdate(
    req.params.id,
    { $push: { songs: req.body.songId } },
    { new: true, useFindAndModify: false }
  );
  res.json(playlist);
};

export const deletePlaylist = async (req: Request, res: Response) => {
  await Playlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Playlist deleted" });
};
