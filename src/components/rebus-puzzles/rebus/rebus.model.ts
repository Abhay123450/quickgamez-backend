import { Document, model, Schema } from "mongoose";
import { Rebus } from "./Rebus.js";
import { Difficulty } from "../../../constants/Difficulty.js";

export interface RebusDocument
    extends Omit<Rebus, "rebusId" | "addedBy">,
        Document {
    addedBy: Schema.Types.ObjectId;
}

export const rebusSchema = new Schema<RebusDocument>(
    {
        rebusImageUrl: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true,
            trim: true
        },
        difficulty: {
            type: String,
            enum: Difficulty,
            required: true,
            lowercase: true,
            trim: true
        },
        explanation: {
            type: String,
            trim: true,
            default: null
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

rebusSchema.index({ rebusImageUrl: 1, answer: 1 }, { unique: true });

export const RebusModel = model<RebusDocument>("Rebus", rebusSchema, "rebus");
