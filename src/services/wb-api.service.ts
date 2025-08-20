import axios from "axios";
import { WbApiFullResponseSchema, WbApiErrorSchema } from "../models/tariff.model.js";

export class WbApiService {
  private readonly baseUrl = "https://common-api.wildberries.ru/api/v1/tariffs/box";

  constructor(private readonly token: string) {}

  async getTariffs(date: Date): Promise<any> {
    try {
      const dateStr = date.toISOString().split("T")[0];
      console.log(`Fetching tariffs for date: ${dateStr}`);

      const response = await axios.get(this.baseUrl, {
        params: { date: dateStr },
        headers: { 
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        },
        timeout: 30000
      });

      console.log("API Response status:", response.status);
      const errorCheck = WbApiErrorSchema.safeParse(response.data);
      if (errorCheck.success && errorCheck.data.detail) {
        console.error("WB API returned error:", errorCheck.data);
        return null;
      }
      const fullResponse = WbApiFullResponseSchema.parse(response.data);
      const tariffsData = fullResponse.response.data;
      
      console.log("Parsed tariffs data:", {
        dtNextBox: tariffsData.dtNextBox,
        dtTillMax: tariffsData.dtTillMax,
        warehouseCount: tariffsData.warehouseList?.length || 0
      });

      if (!tariffsData.warehouseList || tariffsData.warehouseList.length === 0) {
        console.log("No tariffs data available for this date");
        return null;
      }

      console.log(`Successfully fetched ${tariffsData.warehouseList.length} tariffs`);
      return tariffsData;
      
    } catch (error: any) {
      console.error("Error fetching tariffs from WB API:");
      
      if (error.response) {
        console.error("Status:", error.response.status);
        console.error("Data:", JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      
      return null;
    }
  }
}