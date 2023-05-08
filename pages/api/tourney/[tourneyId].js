import { strTimeToSecs, readDataFromCache, writeDataToCache } from "../../../public/helpers/backend"
import { tabulateResults } from "../../../public/helpers/mongo/tabulate"

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
  let cacheData = await readDataFromCache(req.query.tourneyId)
  if (!cacheData) {
    res.status(404).json({ message: `Cannot find tournament ${req.query.tourneyId}` })
    return
  }

  let useCache = (new Date()).getTime() < cacheData.timestamp + 30000 || cacheData.isArchived || cacheData.hasOwnProperty("sheetId")
  if (!useCache) {
    cacheData = await tabulateResults(req.query.tourneyId)
    writeDataToCache(req.query.tourneyId, cacheData)
  }

  res.status(200).json({...cacheData, success: true, cache: useCache})
}