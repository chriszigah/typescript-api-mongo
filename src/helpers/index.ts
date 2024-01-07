import crypto from "crypto";
const dotenv = require("dotenv");
import mongoose, { ConnectOptions } from "mongoose";

export const random = () => crypto.randomBytes(128).toString("base64");

export const authentication = (salt: string, password: string) => {
  const SECRET_KEY: any = process.env.SECRET_KEY;
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET_KEY)
    .digest("hex");
};

export const getenv = () => {
  return process.env.NODE_ENV === undefined || "test"
    ? dotenv.config({ path: "./src/dev.env" })
    : dotenv.config();
};

interface configOptions {
  useNewUrlParser: boolean;
  useCreateIndex: boolean;
  usefindAndModify: boolean;
}

export const connectDB = async (mongoUri: any) => {
  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(
      `MongoDB connected in ${process.env.NODE_ENV} mode on host:${conn.connection.host}`
    );
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
