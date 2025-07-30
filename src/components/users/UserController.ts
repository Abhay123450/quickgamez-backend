import { Request, Response, NextFunction } from "express";

export interface UserController {
    addUser(req: Request, res: Response, next: NextFunction): void;
    getUsers(req: Request, res: Response, next: NextFunction): void;
    getMyDetails(req: Request, res: Response, next: NextFunction): void;
    getUserById(req: Request, res: Response, next: NextFunction): void;
    updateUser(req: Request, res: Response, next: NextFunction): void;
    updateUserPreferences(
        req: Request,
        res: Response,
        next: NextFunction
    ): void;
    deleteUser(req: Request, res: Response, next: NextFunction): void;
    isUserNameAvailable(req: Request, res: Response, next: NextFunction): void;
    saveAvatar(req: Request, res: Response, next: NextFunction): void;
}
