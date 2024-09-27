import { RequestHandler } from "express";
import { Album } from "../models/album";
import { IAlbum, IArtist, ISong } from "../types";
import { Types } from "mongoose";

export const getAlbumsByArtist: RequestHandler = async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const artistId = new Types.ObjectId(req.params.id);
    const findQuery = { artists: { $in: [artistId] } };

    let albums = await Album.find(findQuery)
      .populate({
        path: "songs",
        populate: {
          path: "artists",
        },
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    const filteredAlbums = albums.map((album: IAlbum) => {
      const filteredSongs = (album.songs as ISong[]).filter((song) =>
        (song.artists as unknown as IArtist[]).some(
          (artist) => artist._id!.toString() === artistId.toString()
        )
      );

      return {
        ...album,
        songs: filteredSongs,
      };
    });

    const totalDocuments = await Album.countDocuments(findQuery);

    res.json({
      documents: filteredAlbums,
      totalPages: Math.ceil(totalDocuments / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
