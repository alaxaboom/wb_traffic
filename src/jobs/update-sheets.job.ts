import { DatabaseService } from "../services/database.service.js";
import { GoogleSheetsService } from "../services/google-sheets.service.js";

export async function updateSheetsJob(): Promise<void> {
  try {
    console.log('\n=== 📋 GOOGLE SHEETS UPDATE STARTED ===');
    
    const dbService = new DatabaseService();
    const googleSheetsService = new GoogleSheetsService();
    console.log('📦 Getting data from database...');
    const tariffs = await dbService.getLatestTariffs();
    console.log('✅ Got', tariffs.length, 'tariffs from DB');
    
    if (tariffs.length === 0) {
      console.log('⚠️ No data found in database');
      return;
    }

    console.log('🔄 Updating Google Sheets...');
    const success = await googleSheetsService.updateSheet(tariffs);
    if (success) {
      console.log('🎉 Google Sheets update COMPLETED!');
    } else {
      console.log('💥 Google Sheets update FAILED!');
    }
    console.log('=== ✅ UPDATE FINISHED ===\n');

  } catch (error: any) {
    console.error('💥 Error in updateSheetsJob:', error.message);
  }
}