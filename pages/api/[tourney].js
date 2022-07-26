const reader = require("g-sheets-api");

export default async function handler(req, res) {
  const tourney = req.query.tourney
  const readerOptions = {
    apiKey: process.env.SHEETS_API_KEY,
    sheetId: process.env.NAME_KEY_SHEET,
    returnAllResults: false,
    sheetName: 'Data'
  };
  return new Promise(resolve => {
    reader(readerOptions, data => {
      const tourneyRow = data.filter(row => row["Tourney"].toLowerCase() === tourney.toLowerCase())
      if (tourneyRow.length != 1) {
        res.status(404).json({success: false})
        return resolve()
      } else {
        res.status(200).json({success: true, sheetId: tourneyRow[0]["SheetId"]})
      }
    })
  })
}