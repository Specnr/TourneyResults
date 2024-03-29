const reader = require("g-sheets-api");

export default async function handler(req, res) {
  const readerOptions = {
    apiKey: process.env.SHEETS_API_KEY,
    sheetId: process.env.NAME_KEY_SHEET,
    returnAllResults: false,
    sheetName: 'Data'
  };
  return new Promise((resolve, reject) => {
    reader(readerOptions, async data => {
      const values = data.map(row => (
        {
          label: row["Tourney"],
          order: row["Order"]
        }
      ))
      values.sort((a, b) => {
        if (a.order > b.order)
          return -1
        if (a.order < b.order)
          return 1
        return 0
      })
      res.status(200).json({ success: true, data: values })
      resolve()
    })
  })
}