export const Difficulty = {
    easy: "easy",
    medium: "medium",
    hard: "hard"
} as const;

export type Difficulty = keyof typeof Difficulty;
