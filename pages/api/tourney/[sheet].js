import { strTimeToSecs, byRoundTabulation, overallTabulation, readDataFromCache, writeDataFromCache } from "../../../public/helpers/backend"

const reader = require("g-sheets-api");

const getDataFromRef = async options => {
  const frmtData = []
  await reader(options, data => {
    // Convert time to seconds
    data.forEach(player => {
      const frmtTimes = {}
      Object.keys(player).forEach(key => {
        if (key[0] === "R") {
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
  // If the current cache exists and is less than 30s old, use that
  const cacheData = await readDataFromCache(req.query.sheet)
  if (cacheData.length === 1 && (new Date()).getTime() < cacheData[0].timestamp + 30000) {
    res.status(200).json({...cacheData[0], success: true, cache: true})
    return
  }
  // Otherwise generate new data
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
      const data = { byRound: byRoundTabulation(frmtData), overall: overallTabulation(frmtData), sheetId: req.query.sheet }
      writeDataFromCache(req.query.sheet, data)
      res.status(200).json({...data, success: true, cache: false})
      resolve()
    })
  })
}