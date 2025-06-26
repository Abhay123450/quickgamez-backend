import { User } from "../users/User.js";

export interface Friendship {
    id: string;
    /**
     * user who send the friend request
     */
    userAId: User["userId"];
    /**
     * user who recieves the friend request
     */
    userBId: User["userId"];
    createdAt: Date;
    updatedAt: Date;
    status: "pending" | "accepted" | "rejected" | "blocked";
}
