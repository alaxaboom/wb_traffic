import { WbApiService } from "../services/wb-api.service.js";
import { DatabaseService } from "../services/database.service.js";
import { GoogleSheetsService } from "../services/google-sheets.service.js";
import env from "../config/env/env.js";

export async function fetchTariffsJob(): Promise<void> {
  try {
    console.log("🚀 Starting tariffs fetch job...");
    const wbService = new WbApiService(env.WB_API_TOKEN);
    const dbService = new DatabaseService();
    const googleSheetsService = new GoogleSheetsService();
    const today = new Date();
    console.log(`📅 Date: ${today.toISOString().split("T")[0]}`);
    const tariffsData = await wbService.getTariffs(today);
    if (!tariffsData || !tariffsData.warehouseList || tariffsData.warehouseList.length === 0) {
      console.log("❌ No tariffs data received or empty data");
      return;
    }
    console.log(`📊 Received ${tariffsData.warehouseList.length} tariff records`);
    await dbService.saveOrUpdateTariffs(today, tariffsData.warehouseList);
    console.log("✅ Tariffs successfully saved to database");
    console.log("🔄 Updating Google Sheets with new data...");
    const tariffs = await dbService.getLatestTariffs();
    await googleSheetsService.updateSheet(tariffs);
    console.log("✅ Google Sheets updated successfully");
    
  } catch (error: any) {
    console.error("❌ Error in fetchTariffsJob:", error.message);
  }
}