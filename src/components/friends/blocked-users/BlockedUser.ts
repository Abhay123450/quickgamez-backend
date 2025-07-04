export interface BlockedUser {
    id: string;
    blockedUserId: string;
    blockerUserId: string;
    createdAt: Date;
    updatedAt: Date;
}
