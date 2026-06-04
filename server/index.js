import fs from "fs";
import mongoose from "mongoose";

import { createApp } from "./app.js";
import { serverConfig } from "./config.js";

const app = createApp();

fs.mkdirSync(serverConfig.uploadDir, { recursive: true });

if (!serverConfig.dbUrl) {
  console.error("DB_URL is not set in .env and the server cannot start.");
  process.exit(1);
}

if (process.env.NODE_ENV === "production") {
  console.warn(
    "Uploads are stored on the local filesystem. Render disks are ephemeral unless persistent storage or cloud media storage is configured."
  );
}

mongoose
  .connect(serverConfig.dbUrl, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB connected");
    const server = app.listen(serverConfig.port, () => {
      console.log(`Server running on http://localhost:${serverConfig.port}`);
    });

    const shutdown = async () => {
      server.close(async () => {
        await mongoose.connection.close();
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
