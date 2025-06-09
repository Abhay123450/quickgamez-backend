import { Document, model, Schema } from "mongoose";
import {
    NewRebusPuzzleResult,
    RebusPuzzleResult
} from "./RebusPuzzleResult.js";
import { Difficulty } from "../../../constants/Difficulty.js";

export interface RebusResultDocument
    extends Omit<NewRebusPuzzleResult, "userId" | "rebusId">,
        Document {
    userId: Schema.Types.ObjectId;
    rebusId: Schema.Types.ObjectId;
}

export const rebusResultSchema = new Schema<RebusResultDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        rebusId: {
            type: Schema.Types.ObjectId,
            ref: "Rebus",
            required: true
        },
        difficulty: {
            type: String,
            required: true,
            enum: Difficulty,
            lowercase: true
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
            required: true,
            enum: ["win", "lose"]
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

rebusResultSchema.virtual("rebus", {
    ref: "Rebus",
    localField: "rebusId",
    foreignField: "_id",
    justOne: true
});

rebusResultSchema.virtual("user", {
    ref: "User",
    localField: "userId",
    foreignField: "_id",
    justOne: true
});

rebusResultSchema.methods.toJSON = function () {
    const rebusResult = this.toObject();
    rebusResult.id = rebusResult._id;
    delete rebusResult._id;
    delete rebusResult.__v;
    if (rebusResult.rebus && rebusResult.rebus._id) {
        rebusResult.rebus.id = rebusResult.rebus._id;
        delete rebusResult.rebus._id;
        delete rebusResult.rebusId;
    }
    if (rebusResult.user && rebusResult.user._id) {
        rebusResult.user.id = rebusResult.user._id;
        delete rebusResult.user._id;
        delete rebusResult.userId;
    }
    return rebusResult;
};

export const RebusResultModel = model<RebusResultDocument>(
    "RebusResult",
    rebusResultSchema,
    "rebusResults"
);
