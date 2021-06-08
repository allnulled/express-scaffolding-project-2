const path = require("path");
const winston = require("winston");
const winstonRotate = require("winston-daily-rotate-file");


module.exports = function () {
    try {
        const logger = winston.createLogger({
            levels: {
                emergency: 0,
                alert: 1,
                critical: 2,
                error: 3,
                warning: 4,
                notice: 5,
                inform: 6,
                debug: 7,
            },
            transports: [
                new winston.transports.File({
                    level: "error",
                    filename: path.resolve(process.env.PROJECT_SRC, "logs/error.log"),
                    handleException: true,
                    json: true,
                    maxsize: 5242880,
                    maxFiles: 5,
                    colorize: false,
                }),
                new winston.transports.DailyRotateFile({
                    level: "inform",
                    filename: path.resolve(process.env.PROJECT_SRC, "logs/all.%DATE%.log"),
                    zippedArchive: true,
                    handleException: true,
                    json: true,
                    maxsize: 5242880,
                    maxFiles: 5,
                    colorize: false,
                }),
            ],
            exitOnError: false,
        });
        winston.addColors({
            emergency: "red",
            alert: "red",
            critical: "red",
            error: "red",
            warning: "yellow",
            notice: "blue",
            inform: "blue",
            debug: "green",
        });
        if (process.env.NODE_ENV !== "production") {
            logger.add(new winston.transports.Console({
                level: "debug",
                handleException: true,
                json: false,
                colorize: true,
            }));
        }
        logger.stream = {
            write(message, encoding) {
                logger.info(message);
            }
        };
        return logger;
    } catch (error) {
        console.error("Error on src/batches/utils/logger.imm.js:", error);
        throw error;
    }
}