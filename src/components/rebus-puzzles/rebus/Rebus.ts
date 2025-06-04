import { Difficulty } from "../../../constants/Difficulty.js";
import { User } from "../../users/User.js";

export interface Rebus {
    rebusId: string;
    rebusImageUrl: string;
    answer: string;
    difficulty: Difficulty;
    explanation?: string | null;
    createdAt: Date;
    updatedAt: Date;
    addedBy: User["userId"] | Partial<User>;
}

export interface NewRebus
    extends Omit<
        Rebus,
        "rebusId" | "rebusImageUrl" | "createdAt" | "updatedAt"
    > {
    rebusImage: any;
}
