import { strTimeToSecs, byRoundTabulation, overallTabulation } from "../../../public/helpers/backend"

const reader = require("g-sheets-api");

export default async function handler(req, res) {
  const readerOptions = {
    apiKey: process.env.SHEETS_API_KEY,
    sheetId: req.query.sheet,
    returnAllResults: false,
    sheetName: 'Data'
  };
  return new Promise(resolve => {
    reader(readerOptions, data => {
      // Convert time to seconds
      const frmtData = data.map(player => {
        const frmtTimes = {}
        Object.keys(player).forEach(key => {
          if (key !== "Player")
            frmtTimes[key] = player[key].includes(":") ? strTimeToSecs(player[key]) : -1
        })
        return {name: player.Player, ...frmtTimes}
      })
      return res.status(200).json({ success: true, data: frmtData, byRound: byRoundTabulation(frmtData), overall: overallTabulation(frmtData) })
    })
  })
}