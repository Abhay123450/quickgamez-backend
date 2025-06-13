import { User } from "../../users/User.js";
import { Rebus } from "./Rebus.js";

export interface RebusRepository {
    addRebus(
        rebus: Omit<Rebus, "rebusId" | "createdAt" | "updatedAt">
    ): Promise<Rebus>;
    addRebusMany(
        rebuses: Omit<Rebus, "rebusId" | "createdAt" | "updatedAt">[]
    ): Promise<Rebus[]>;
    getRebusById(rebusId: Rebus["rebusId"]): Promise<Rebus>;
    getRebus(
        filter: Partial<Rebus>,
        page?: number,
        count?: number
    ): Promise<Rebus[]>;
    getRandomRebus(
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]>;
    getUnplayedRebus(
        userId: User["userId"],
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]>;
    deleteRebus(rebusId: Rebus["rebusId"]): Promise<Rebus>;
}
