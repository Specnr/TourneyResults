import { strTimeToSecs, readDataFromCache } from "../../../public/helpers/backend"

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
  const cacheData = await readDataFromCache(req.query.tourneyId)
  if (cacheData.length === 1 && ((new Date()).getTime() < cacheData[0].timestamp + 30000 || cacheData.sheetId !== null)) {
    res.status(200).json({...cacheData[0], success: true, cache: true})
    return
  }

  res.status(404).json({ message: `Cannot find tournament ${req.query.tourneyId}` })
}