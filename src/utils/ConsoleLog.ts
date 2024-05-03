import colors from "colors";

export class ConsoleLog {
    public static log = (message: any) => {
        console.log(
            colors.bgWhite(`[${new Date().toLocaleString()}] [LOG]`),
            typeof message === "string" ? colors.bgWhite(message) : message
        );
    };
    public static info = (message: any) => {
        console.log(
            colors.bgBlue(`[${new Date().toLocaleString()}] [INFO]`),
            typeof message === "string" ? colors.bgBlue(message) : message
        );
    };
    public static success = (message: any) => {
        console.log(
            colors.bgGreen(`[${new Date().toLocaleString()}] [SUCCESS]`),
            typeof message === "string"
                ? colors.bgGreen(colors.white(message))
                : message
        );
    };
    public static warning = (message: any) => {
        console.log(
            colors.bgYellow(`[${new Date().toLocaleString()}] [WARN]`),
            typeof message === "string" ? colors.bgYellow(message) : message
        );
    };
    public static error = (message: any) => {
        console.log(
            colors.bgRed(`[${new Date().toLocaleString()}] [ERROR]`),
            typeof message === "string" ? colors.bgRed(message) : message
        );
    };
}
