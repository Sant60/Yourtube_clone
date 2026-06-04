import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim().replace(/\/+$/, ""))
    .filter(Boolean);
}

export const serverConfig = {
  port: Number(process.env.PORT || 5000),
  dbUrl: process.env.DB_URL || "",
  uploadDir: process.env.UPLOAD_DIR
    ? path.resolve(process.env.UPLOAD_DIR)
    : path.join(__dirname, "uploads"),
  allowedOrigins: Array.from(
    new Set([
      ...parseOrigins(process.env.CLIENT_URL),
      ...parseOrigins(process.env.CORS_ORIGINS),
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ])
  ),
};

export function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  const normalized = origin.replace(/\/+$/, "");
  if (serverConfig.allowedOrigins.includes(normalized)) {
    return true;
  }

  try {
    return /\.vercel\.app$/i.test(new URL(normalized).hostname);
  } catch {
    return false;
  }
}
