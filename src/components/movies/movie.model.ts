import { Document, Schema, model } from "mongoose";
import { Movie } from "./interfaces/Movie.js";

export interface MovieDocument extends Movie, Document {
    createdAt: Date;
}

const movieSchema = new Schema<MovieDocument>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    industry: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
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
    hints: [
        {
            type: String,
            trim: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

export const MovieModel = model<MovieDocument>("Movie", movieSchema, "movies");
