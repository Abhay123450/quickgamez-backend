import mongoose from "mongoose";
import { ConsoleLog } from "../utils/ConsoleLog.js";

export let connectToDB = async () => {
    const MONGO_USERNAME = process.env.MONGO_USERNAME;
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
    if (!MONGO_USERNAME || !MONGO_PASSWORD) {
        return ConsoleLog.error(
            "Cannot connect to database. Invalid credentials."
        );
    }
    const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.ge3w1pn.mongodb.net/main?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose
        .connect(MONGO_URL)
        .then(() => {
            ConsoleLog.success("Connected to MongoDB");
        })
        .catch((error) => {
            ConsoleLog.error(error);
        });
};
