import { Request, Response, NextFunction } from "express";

// @ts-ignore
function apiRules(req: Request, res: Response, next: NextFunction) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST");
        return res.status(200).json({});
    }

    next();
}

export { apiRules };
