import dotenv from "dotenv";
dotenv.config();

import express, { Express, Request, Response, NextFunction } from "express";
import { connectToDB } from "./config/db.config";
import { ConsoleLog } from "./utils/ConsoleLog";
import { sendResponseSuccess } from "./utils/sendResponse";
import { HttpStatusCode } from "./constants/httpStatusCode.enum";

const port: number = Number(process.env.PORT) || 4000;

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to MongoDB Atlas
connectToDB();

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    // res.send(await UserRepository.add("Abhay"));
    // res.send(`${new Date()} ||||| ${DateUtil.addToCurrentDate(30, 15)}`);
    sendResponseSuccess(res, HttpStatusCode.ACCEPTED, "done", {});
});

app.listen(port, () => {
    ConsoleLog.success(`Server listening on port ${port}`);
});
