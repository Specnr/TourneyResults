import { strTimeToSecs, byRoundTabulation, overallTabulation } from "../../../public/helpers/backend"

const reader = require("g-sheets-api");

const getDataFromRef = async options => {
  const frmtData = []
  await reader(options, data => {
    // Convert time to seconds
    data.forEach(player => {
      const frmtTimes = {}
      Object.keys(player).forEach(key => {
        if (key !== "Player") {
          frmtTimes[key] = player[key].includes(":") ? strTimeToSecs(player[key]) : -1
          if (player[key].toLowerCase() === "finish" || player[key].toLowerCase() === "skip")
            frmtTimes[key] = -2
        }
      })
      frmtData.push({name: player.Player, ...frmtTimes})
    })
  })
  return frmtData
}

export default async function handler(req, res) {
  return new Promise((resolve, reject) => {
    const readerRefOptions = {
      apiKey: process.env.SHEETS_API_KEY,
      sheetId: req.query.sheet,
      returnAllResults: false,
      sheetName: 'Refs'
    };
    reader(readerRefOptions, async refs => {
      const frmtData = (await Promise.all(refs.map(async ref => {
        const readerOptions = {
          apiKey: process.env.SHEETS_API_KEY,
          sheetId: req.query.sheet,
          returnAllResults: false,
          sheetName: `${ref.Name} Ref`
        };
        return getDataFromRef(readerOptions)
      }))).reduce((prev, curr) => prev.concat(curr), [])
      res.status(200).json({ success: true, data: frmtData, byRound: byRoundTabulation(frmtData), overall: overallTabulation(frmtData) })
      resolve()
    })
  })
}