import db from "../postgres/knex.js";
import { WarehouseBoxRates } from "../models/tariff.model.js";

export class DatabaseService {
  async saveOrUpdateTariffs(date: Date, tariffs: WarehouseBoxRates[]): Promise<void> {
    if (!tariffs || tariffs.length === 0) {
      console.log("No tariffs to save");
      return;
    }

    const dateStr = date.toISOString().split("T")[0];
    console.log(`Saving ${tariffs.length} tariffs for date: ${dateStr}`);
    
    let savedCount = 0;
    
    for (const tariff of tariffs) {
      try {
        console.log("Processing tariff for warehouse:", tariff.warehouseName);
        
        await db("tariffs")
          .insert({
            date: dateStr,
            warehouse_name: tariff.warehouseName,
            geo_name: tariff.geoName,
            box_delivery_base: tariff.boxDeliveryBase,
            box_delivery_coef_expr: tariff.boxDeliveryCoefExpr,
            box_delivery_liter: tariff.boxDeliveryLiter,
            box_delivery_marketplace_base: tariff.boxDeliveryMarketplaceBase,
            box_delivery_marketplace_coef_expr: tariff.boxDeliveryMarketplaceCoefExpr,
            box_delivery_marketplace_liter: tariff.boxDeliveryMarketplaceLiter,
            box_storage_base: tariff.boxStorageBase,
            box_storage_coef_expr: tariff.boxStorageCoefExpr,
            box_storage_liter: tariff.boxStorageLiter,
            updated_at: db.fn.now()
          })
          .onConflict(["date", "warehouse_name"])
          .merge();
        
        savedCount++;
        console.log(`✓ Saved tariff for ${tariff.warehouseName}`);
        
      } catch (error: any) {
        console.error(`✗ Failed to save tariff for ${tariff.warehouseName}:`, error.message);
      }
    }
    console.log(`✅ Successfully saved ${savedCount} out of ${tariffs.length} tariffs`);
  }
    async getLatestTariffs(): Promise<any[]> {
    return db("tariffs")
      .where("date", db.raw("CURRENT_DATE"))
      .orderBy("box_storage_coef_expr", "asc")
      .select("*");
  }
  async checkTariffsCount(): Promise<number> {
    const result = await db("tariffs").count("* as count").first();
    const count = result?.count;
    
    if (typeof count === 'string') {
      return parseInt(count, 10);
    } else if (typeof count === 'number') {
      return count;
    } else if (count && typeof count === 'object' && 'count' in count) {
      return parseInt(String((count as any).count), 10);
    }
    
    return 0;
  }
}