import { RequestHandler } from "express";
import { Album } from "../models/album";
import { IAlbum, ISong } from "../types";
import { ObjectId, Types } from "mongoose";

export const getAlbumsByArtist: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const artistId = new Types.ObjectId(req.params.id);
    const findQuery = { artists: { $in: [artistId] } };

    let albums = await Album.find(findQuery)
      .populate<{ songs: ISong[] }>("songs")
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const filteredAlbums = albums.map((album: IAlbum) => {
      const { songs, ...rest } = album.toObject();
      const filteredSongs = (songs as ISong[]).filter((song: ISong) =>
        song.artists.some(
          (artist: ObjectId) => artist.toString() === artistId.toString()
        )
      );
      return {
        ...rest,
        songs: filteredSongs,
      };
    });

    const totalDocuments = await Album.countDocuments({ findQuery });

    res.json({
      documents: filteredAlbums,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
