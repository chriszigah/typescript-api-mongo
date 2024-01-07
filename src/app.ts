import { getenv } from "./helpers";
const express = require("express");
import { Request, Response, NextFunction } from "express";

import cookieParser from "cookie-parser";
import compression from "compression";
const cors = require("cors");
import morgan from "morgan";
import helmet from "helmet";

import session from "express-session";
import IORedis from "ioredis";
import RedisStore from "connect-redis";

import router from "./routes";

// Setup Up Environment
getenv();

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Helmet (no-cache)
app.use(helmet());

const redisClient = new IORedis(
  process.env.REDIS_URL || "redis://127.0.0.1:6379"
);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SECRET_KEY as any,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 3,
    },
  })
);

// Logging
app.use(morgan("dev"));
app.use(morgan("combined"));
//app.use(morgan("combined", { stream: accessLogStream }));
/*
morgan.token("sessionid", (req, res, param)=> {
  return req.sessionID ? req.sessionID : "NO SESSION ";
});
            
morgan.token("user", (req, res, param)=> {
  try {
  } catch (error) {
    return null;
  }
});

app.use(
  morgan(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ' //":user-agent" :user :sessionid
  )
);*/

app.use(router);

//Error Handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ msg: "Unable to find the requested resource!" });
});

export default app;
