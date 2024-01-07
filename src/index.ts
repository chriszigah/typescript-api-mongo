import http from "http";
import { connectDB } from "./helpers";
import app from "./app";

import logger from "./helpers/logger";

const server = http.createServer(app);

const PORT = process.env.PORT || 7242;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    logger.info(`App is running at http://localhost:${PORT}`);
    server.listen(PORT, () => {
      console.log(
        `Server is running in ${process.env.NODE_ENV} mode on Port ${PORT} (^_^)`
      );
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();
