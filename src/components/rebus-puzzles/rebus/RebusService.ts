import { Difficulty } from "../../../constants/Difficulty.js";
import { User } from "../../users/User.js";
import { NewRebus, Rebus } from "./Rebus.js";

export interface RebusService {
    addRebus(rebus: NewRebus): Promise<Rebus>;
    addRebusMany(rebus: NewRebus[]): Promise<Rebus[]>;
    getRebusById(rebusId: string): Promise<Rebus>;
    getRebus(
        filter: Partial<Rebus>,
        page?: number,
        count?: number
    ): Promise<Rebus[]>;
    getRandomRebus(
        difficulty: Rebus["difficulty"],
        count: number
    ): Promise<Rebus[]>;
    getUnplayedRebus(
        userId: User["userId"],
        difficulty: Rebus["difficulty"],
        count: number
    ): Promise<Rebus[]>;
}
