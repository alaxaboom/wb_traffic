import { z } from "zod";

export const WarehouseBoxRatesSchema = z.object({
  boxDeliveryAndStorageExpr: z.string().optional(),
  boxDeliveryBase: z.string(),
  boxDeliveryCoefExpr: z.string(),
  boxDeliveryLiter: z.string(),
  boxDeliveryMarketplaceBase: z.string(),
  boxDeliveryMarketplaceCoefExpr: z.string(),
  boxDeliveryMarketplaceLiter: z.string(),
  boxStorageBase: z.string(),
  boxStorageCoefExpr: z.string(),
  boxStorageLiter: z.string(),
  geoName: z.string(),
  warehouseName: z.string(),
});

export const TariffsBoxResponseSchema = z.object({
  dtNextBox: z.string().optional(),
  dtTillMax: z.string().optional(),
  warehouseList: z.array(WarehouseBoxRatesSchema).optional(),
});

export const WbApiErrorSchema = z.object({
  title: z.string().optional(),
  detail: z.string().optional(),
  code: z.string().optional(),
  requestId: z.string().optional(),
  origin: z.string().optional(),
  status: z.number().optional(),
  statusText: z.string().optional(),
  timestamp: z.string().optional(),
});

export const WbApiFullResponseSchema = z.object({
  response: z.object({
    data: TariffsBoxResponseSchema
  })
});

export type WarehouseBoxRates = z.infer<typeof WarehouseBoxRatesSchema>;
export type TariffsBoxResponse = z.infer<typeof TariffsBoxResponseSchema>;
export type WbApiError = z.infer<typeof WbApiErrorSchema>;
export type WbApiFullResponse = z.infer<typeof WbApiFullResponseSchema>;