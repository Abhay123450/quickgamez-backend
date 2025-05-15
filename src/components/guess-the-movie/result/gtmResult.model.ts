import { Document, Schema, model } from "mongoose";
import { NewGuessTheMovieResult } from "./GTMResult.js";

export interface GTMResultDocument
    extends Omit<NewGuessTheMovieResult, "movieId" | "userId">,
        Document {
    movieId: Schema.Types.ObjectId;
    userId: Schema.Types.ObjectId;
}

export const gtmresultSchema = new Schema<GTMResultDocument>(
    {
        movieId: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        industry: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        movieNameUnguessed: {
            type: String,
            required: true
        },
        startedAt: {
            type: Date,
            required: true
        },
        endedAt: {
            type: Date,
            required: true
        },
        livesUsed: {
            type: Number,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
        isTimerOn: {
            type: Boolean,
            required: true
        },
        timeGiven: {
            type: Number,
            required: true
        },
        timeLeft: {
            type: Number,
            required: true
        },
        result: {
            type: String,
            required: true
        },
        guesses: [
            {
                character: {
                    type: String,
                    required: true
                },
                isCorrect: {
                    type: Boolean,
                    required: true
                },
                guessedAt: {
                    type: Date,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

gtmresultSchema.virtual("movie", {
    ref: "Movie",
    localField: "movieId",
    foreignField: "_id",
    justOne: true
});

gtmresultSchema.methods.toJSON = function () {
    const gtmresult = this.toObject();
    gtmresult.id = gtmresult._id;
    delete gtmresult._id;
    if (gtmresult.movie && gtmresult.movie._id) {
        gtmresult.movie.id = gtmresult.movie._id;
        delete gtmresult.movie._id;
        delete gtmresult.movieId;
    }
    if (gtmresult.user && gtmresult.user._id) {
        gtmresult.user.id = gtmresult.user._id;
        delete gtmresult.user._id;
        delete gtmresult.userId;
    }
    return gtmresult;
};

export const GTMResultModel = model<GTMResultDocument>(
    "GTMResult",
    gtmresultSchema,
    "gtmresults"
);
