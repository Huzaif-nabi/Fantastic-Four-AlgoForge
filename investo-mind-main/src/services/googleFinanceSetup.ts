// Instructions for setting up Google Sheets with Google Finance formulas
// 1. Create a new Google Sheet
// 2. Add the following formulas to the specified cells:

/*
Sheet1:

A1: =GOOGLEFINANCE("AAPL", "price")  // Current price
B1: =GOOGLEFINANCE("AAPL", "name")    // Company name
C1: =GOOGLEFINANCE("AAPL", "sector")  // Company sector

A2:A30: =GOOGLEFINANCE("AAPL", "price", TODAY()-30, TODAY())  // Historical prices
B2:B30: =GOOGLEFINANCE("AAPL", "volume", TODAY()-30, TODAY()) // Historical volumes

A32:A36: =GOOGLEFINANCE("AAPL", "high")   // High price
B32:B36: =GOOGLEFINANCE("AAPL", "low")    // Low price
C32:C36: =GOOGLEFINANCE("AAPL", "volume") // Volume
*/

// Note: Replace "AAPL" with the stock symbol you want to track
// The sheet ID in stockApi.ts should be updated with your sheet's ID
// You can get the sheet ID from the URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit

export const GOOGLE_FINANCE_FORMULAS = {
  currentPrice: '=GOOGLEFINANCE("{symbol}", "price")',
  companyName: '=GOOGLEFINANCE("{symbol}", "name")',
  companySector: '=GOOGLEFINANCE("{symbol}", "sector")',
  historicalPrices: '=GOOGLEFINANCE("{symbol}", "price", TODAY()-30, TODAY())',
  historicalVolumes: '=GOOGLEFINANCE("{symbol}", "volume", TODAY()-30, TODAY())',
  highPrice: '=GOOGLEFINANCE("{symbol}", "high")',
  lowPrice: '=GOOGLEFINANCE("{symbol}", "low")',
  volume: '=GOOGLEFINANCE("{symbol}", "volume")'
}; 