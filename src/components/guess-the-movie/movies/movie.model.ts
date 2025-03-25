import { Document, Schema, model } from "mongoose";
import { Movie } from "./interfaces/Movie.js";
import { Difficulty } from "../../../constants/Difficulty.js";

export interface MovieDocument extends Omit<Movie, "id">, Document {
    createdAt: Date;
}

const movieSchema = new Schema<MovieDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        industry: {
            type: String,
            enum: ["HOLLYWOOD", "BOLLYWOOD"],
            required: true,
            trim: true,
            uppercase: true
        },
        difficulty: {
            type: String,
            enum: Difficulty,
            required: true,
            trim: true,
            lowercase: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        actors: [
            {
                type: String,
                trim: true
            }
        ],
        director: {
            type: String,
            required: true,
            trim: true
        },
        genre: [
            {
                type: String,
                trim: true
            }
        ],
        productionHouse: {
            type: String,
            trim: true
        },
        boxOfficeStatus: {
            type: String,
            trim: true
        },
        boxOfficeCollection: {
            type: String
        },
        hints: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        timestamps: true
    }
);

movieSchema.methods.toJSON = function () {
    const movie = this.toObject();
    movie.id = movie._id;
    delete movie._id;
    delete movie.__v;
    return movie;
};

export const MovieModel = model<MovieDocument>("Movie", movieSchema, "movies");
