import { ClientError } from "../../../utils/AppErrors.js";
import { User } from "../../users/User.js";
import { Rebus } from "./Rebus.js";
import { RebusModel } from "./rebus.model.js";
import { RebusRepository } from "./RebusRepository.js";
import { RebusResultModel } from "../result/rebusResult.model.js";

export class RebusRepositoryImpl implements RebusRepository {
    async addRebus(
        rebus: Omit<Rebus, "rebusId" | "createdAt" | "updatedAt">
    ): Promise<Rebus> {
        const rebusModel = new RebusModel(rebus);
        const savedRebus = await rebusModel.save();
        if (!savedRebus) {
            throw new Error("Failed to save rebus.");
        }
        return this._convertRebusDocumentToRebus(savedRebus);
    }
    async addRebusMany(
        rebuses: Omit<Rebus, "rebusId" | "createdAt" | "updatedAt">[]
    ): Promise<Rebus[]> {
        const rebusModels = rebuses.map((r) => new RebusModel(r));
        const savedRebus = await RebusModel.insertMany(rebusModels);
        if (!savedRebus) {
            throw new Error("Failed to save rebus.");
        }
        return savedRebus.map((r) => this._convertRebusDocumentToRebus(r));
    }
    async getRebusById(rebusId: string): Promise<Rebus> {
        const rebusDocument = await RebusModel.findById(rebusId);
        if (!rebusDocument) {
            throw new ClientError("Rebus not found", 404);
        }
        return this._convertRebusDocumentToRebus(rebusDocument);
    }
    async getRebus(filter: Partial<Rebus>): Promise<Rebus[]> {
        const rebusDocuments = await RebusModel.find(filter);
        return rebusDocuments.map((r) => this._convertRebusDocumentToRebus(r));
    }
    async getRandomRebus(
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]> {
        const filter: Partial<Pick<Rebus, "difficulty">> = {};
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        const rebusDocuments = await RebusModel.aggregate([
            { $match: filter },
            { $sample: { size: count } }
        ]);
        return rebusDocuments.map((r) => this._convertRebusDocumentToRebus(r));
    }
    async getUnplayedRebus(
        userId: User["userId"],
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]> {
        const playedRebus = await RebusResultModel.find({ userId: userId });
        const playedRebusIds = playedRebus.map(
            (rebusResult) => rebusResult.rebusId
        );
        const filter: Partial<Pick<Rebus, "difficulty">> = {};
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        const rebusDocuments = await RebusModel.aggregate([
            { $match: { _id: { $nin: playedRebusIds }, ...filter } },
            { $sample: { size: count } }
        ]);
        return rebusDocuments.map((r) => this._convertRebusDocumentToRebus(r));
    }

    async deleteRebus(rebusId: string): Promise<Rebus> {
        const rebusDocument = await RebusModel.findByIdAndDelete(rebusId);
        return this._convertRebusDocumentToRebus(rebusDocument);
    }

    private _convertRebusDocumentToRebus(rebusDocument: any): Rebus {
        return {
            rebusId: rebusDocument._id.toString(),
            rebusImageUrl: rebusDocument.rebusImageUrl,
            answer: rebusDocument.answer,
            difficulty: rebusDocument.difficulty,
            explanation: rebusDocument.explanation,
            createdAt: rebusDocument.createdAt,
            updatedAt: rebusDocument.updatedAt,
            addedBy: rebusDocument.addedBy
        };
    }
}
