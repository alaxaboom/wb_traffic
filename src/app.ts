import { scheduleJob } from "node-schedule";
import { fetchTariffsJob } from "./jobs/fetch-tariffs.job.js";
import { updateSheetsJob } from "./jobs/update-sheets.job.js";
import db from "./postgres/knex.js";
import env from "./config/env/env.js";

async function initializeDatabase(): Promise<void> {
  try {
    console.log("Initializing database...");
    await db.raw("SELECT 1");
    await db.migrate.latest();
    console.log("Database initialized");
  } catch (error: any) {
    console.error("Database initialization failed:", error.message);
    throw error;
  }
}

async function startScheduler(): Promise<void> {
  console.log("Starting scheduler...");
  
  scheduleJob("0 * * * *", fetchTariffsJob);
  
  scheduleJob("0 */6 * * *", updateSheetsJob);
  
  console.log("Running initial update...");
  await updateSheetsJob();
}

async function main(): Promise<void> {
  try {
    console.log("Starting WB Tariffs Service...");
    await initializeDatabase();
    await startScheduler();
    console.log("Service started successfully");
  } catch (error: any) {
    console.error("Failed to start service:", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  console.log("Shutting down service...");
  await db.destroy();
  process.exit(0);
});

main();