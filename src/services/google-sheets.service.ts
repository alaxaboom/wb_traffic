import { google } from 'googleapis';
import env from '../config/env/env.js';

export class GoogleSheetsService {
  private sheets: any;
  private auth: any;

  constructor() {
    this.auth = new google.auth.JWT({
      email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
  }

  async updateSheet(data: any[]): Promise<boolean> {
  const spreadsheetId = env.GOOGLE_SHEET_ID;

  try {
    console.log('🔗 Connecting to Google Sheets...');

    if (!data.length) {
      console.log('⚠️ No data to update');
      return false;
    }

    // Заголовки столбцов
    const headers = [
      'Дата', 'Склад', 'Регион', 
      'Логистика база', 'Коэф. логистики', 'Логистика доп. литр',
      'FBS база', 'Коэф. FBS', 'FBS доп. литр',
      'Хранение база', 'Коэф. хранения', 'Хранение доп. литр',
      'Обновлено'
    ];
    const values = data.map(item => [
      item.date,
      item.warehouse_name,
      item.geo_name,
      item.box_delivery_base,
      item.box_delivery_coef_expr,
      item.box_delivery_liter,
      item.box_delivery_marketplace_base,
      item.box_delivery_marketplace_coef_expr,
      item.box_delivery_marketplace_liter,
      item.box_storage_base,
      item.box_storage_coef_expr,
      item.box_storage_liter,
      new Date().toLocaleString('ru-RU')
    ]);
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'stocks_coefs!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [headers, ...values] }
    });

    console.log('✅ Google Sheet updated with headers!');
    return true;

  } catch (error: any) {
    console.error('❌ Google Sheets update failed:', error.message);
    return false;
  }
}
  
}