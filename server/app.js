import express from "express";
import cors from "cors";
import path from "path";

import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import { isAllowedOrigin, serverConfig } from "./config.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ limit: "30mb", extended: true }));
  app.use("/uploads", express.static(path.resolve(serverConfig.uploadDir)));

  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "YourTube backend is running" });
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/user", userroutes);
  app.use("/video", videoroutes);
  app.use("/like", likeroutes);
  app.use("/watch", watchlaterroutes);
  app.use("/history", historyrroutes);
  app.use("/comment", commentroutes);

  app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || "Internal server error" });
  });

  return app;
}
