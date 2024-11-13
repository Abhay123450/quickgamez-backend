console.log("=======================================");

import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectToDB } from "./config/db.config.js";
import { ConsoleLog } from "./utils/ConsoleLog.js";
import { sendResponseSuccess } from "./utils/sendResponse.js";
import { movieRouter } from "./components/movies/movie.routes.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import { userRouter } from "./components/users/user.route.js";

const port: number = Number(process.env.PORT) || 4000;

const app: Express = express();

app.use(
    cors({
        credentials: true,
        origin: [
            "http://192.168.1.6:5173",
            "http://localhost:5173",
            "http://192.168.1.7:5173",
            "http://192.168.1.4:5173"
        ]
    })
);

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB Atlas
connectToDB();

// Middleware to redirect all routes with trailing slash to without trailing slash
app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path.endsWith("/") && req.path.length > 1) {
        const newPath = req.path.slice(0, -1) + req.url.slice(req.path.length);
        res.redirect(301, newPath);
    } else {
        next();
    }
});

// Routes
app.use("/api/v1", movieRouter);
app.use("/api/v1", userRouter);

app.get("/api/v1/health-check", (req: Request, res: Response) => {
    sendResponseSuccess(res, "Server is up and running");
});

app.use(errorHandler);

app.listen(port, () => {
    ConsoleLog.success(`Server listening on port ${port}`);
});
