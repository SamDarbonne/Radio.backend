import { Request, Response } from "express";
import { Artist } from "../models/artist";
import { IArtist } from "../types";

export const getArtists = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = 10;
  const artists: IArtist[] = await Artist.find({})
    .populate({ path: "albums", select: "name" })
    .skip((page - 1) * limit)
    .limit(limit);
  const totalDocuments = await Artist.countDocuments();

  res.json({
    documents: artists,
    totalPages: Math.ceil(totalDocuments / limit),
  });
};

export const getArtistById = async (req: Request, res: Response) => {
  const artist = await Artist.findById(req.params.id).populate("albums");
  res.json(artist);
};
