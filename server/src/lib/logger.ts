import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.isProd ? "info" : "debug",
  // Never let a credential reach the log store.
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "res.headers['set-cookie']",
      "*.password",
      "*.passwordHash",
      "*.token",
    ],
    censor: "[redacted]",
  },
  transport: env.isProd
    ? undefined // production ships raw JSON for log aggregators
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss",
          // Every request otherwise dumps ~40 lines of headers, burying the
          // one line that matters. The full objects still ship in production
          // JSON, where a log tool can index them.
          ignore: "pid,hostname,req,res,responseTime,reqId,request,response",
        },
      },
});
