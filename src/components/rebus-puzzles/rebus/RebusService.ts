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
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]>;
    getUnplayedRebus(
        userId: User["userId"],
        count: number,
        difficulty?: Rebus["difficulty"]
    ): Promise<Rebus[]>;
    deleteRebus(rebusId: string): Promise<boolean>;
}
