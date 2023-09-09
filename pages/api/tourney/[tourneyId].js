import { readDataFromCache, writeDataToCache } from "../../../public/helpers/backend"
import { tabulateResults } from "../../../public/helpers/mongo/tabulate"

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