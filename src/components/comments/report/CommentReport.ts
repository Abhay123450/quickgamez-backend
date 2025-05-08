export interface CommentReport {
    commentId: string;
    userId: string; // reported by
    reason: string;
    createdAt: Date;
    isReviewed: boolean;
    reviewedAt: Date | null;
    reviewedBy: string | null;
    reviewResult: "accepted" | "rejected" | null;
}
