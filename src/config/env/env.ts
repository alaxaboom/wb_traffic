import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  POSTGRES_HOST: z.string().default("localhost"),
  POSTGRES_PORT: z.string().transform(Number).default("5432"),
  POSTGRES_DB: z.string().default("wb_api"),
  POSTGRES_USER: z.string().default("postgres"),
  POSTGRES_PASSWORD: z.string().default("postgres"),
  APP_PORT: z.string().transform(Number).default("5000"),
  WB_API_TOKEN: z.string(),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  GOOGLE_SHEET_ID: z.string(),
});

const env = envSchema.parse(process.env);
export default env;