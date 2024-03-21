import winston from "winston";
import config from "./config.js";
import { __dirname } from "./utils.js";

// Define el sistema de niveles
const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

const levelNames = [
  "fatal",
  "error",
  "warning",
  "info",
  "http",
  "debug",
];

const getLevel = (level) => {
  return levels[level] || 5; //default
};

// Crea los loggers
const devLogger = winston.createLogger({
  level: "debug",
  levels,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.label({ label: "development" }),
        winston.format.printf(({ level, message, label }) => {
          // Usa chalk para agregar colores a los mensajes según el nivel
          let colorizedMessage = message;
          if (level === "error") {
            colorizedMessage = chalk.red(message);
          } else if (level === "warning") {
            colorizedMessage = chalk.yellow(message);
          } else if (level === "info") {
            colorizedMessage = chalk.green(message);
          } else if (level === "debug") {
            colorizedMessage = chalk.blue(message);
          }
          return `${label} [${levelNames[getLevel(level)]}] ${colorizedMessage}`;
        })
      ),
    }),
  ],
});

const prodLogger = winston.createLogger({
  level: "info",
  levels,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.printf(({ level, message, label }) => {
          // Usa chalk para agregar colores a los mensajes según el nivel
          let colorizedMessage = message;
          if (level === "error") {
            colorizedMessage = chalk.red(message);
          } else if (level === "warning") {
            colorizedMessage = chalk.yellow(message);
          } else if (level === "info") {
            colorizedMessage = chalk.green(message);
          } else if (level === "debug") {
            colorizedMessage = chalk.blue(message);
          }
          return `${label} [${levelNames[getLevel(level)]}] ${colorizedMessage}`;
        })
      ),
    }),
    new winston.transports.File({
      level: "error",
      filename: `${__dirname}/logs/errors.log`,
      format: winston.format.combine(
        winston.format.label({ label: "production" }),
        winston.format.printf(({ level, message, label }) => {
          return `${label} [${levelNames[getLevel(level)]}] ${message}`;
        })
      ),
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger =
    config.MODE === "devel" ? devLogger : prodLogger;
  req.logger.http(`${new Date().toDateString()} ${req.method} ${req.url}`);
  next();
};

export default addLogger;