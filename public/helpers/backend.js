import { MongoClient } from 'mongodb'
const resultsCol = new MongoClient(process.env.MONGO_URI).db().collection('Results')

export const readDataFromCache = sheetId => resultsCol.find({ sheetId }).toArray()

export const writeDataFromCache = (sheetId, data) => (resultsCol.updateOne({ sheetId }, { $set: {...data, timestamp: (new Date()).getTime()} }, { upsert: true }))

export const strTimeToSecs = (strTime) => {
  const [mins, secs] = strTime.split(":")
  return parseInt(mins)*60 + parseInt(secs)
}

export const byRoundTabulation = (data) => {
  const roundData = {}
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key, idx) => {
      if (key !== "name") {
        roundData[key] = data
        .map(item => ( { name: item.name, time: item[key] } ))
        .sort((a, b) => {
          const [a1, b1] = [a.time, b.time]
          if (a1 === -1)
            return 1
          if (b1 === -1)
            return -1
          return a1 - b1
        })
      }
    })
  }
  return roundData
}

const completedRuns = player => Object.values(player).reduce((t, c) => t + (c !== -1), -1)
const hasCompletedRound = (player, round) => player[`Round ${round}`] !== -1
const sumOfTimes = player => Object.values(player).reduce((t, c, i) => t + (i > 0 && c !== -1 ? c : 0), 0)

export const overallTabulation = (data) => {
  return [...data].sort((a, b) => {
    const [compA, compB] = [completedRuns(a), completedRuns(b)]
    if (hasCompletedRound(a, 8))
      return -1
    if (hasCompletedRound(b, 8))
      return 1
    if (hasCompletedRound(a, 7) && !hasCompletedRound(b, 7))
      return -1
    if (hasCompletedRound(b, 7) && !hasCompletedRound(a, 7))
      return 1
    if (compA === compB) {
      return sumOfTimes(a) - sumOfTimes(b)
    }
    return compB - compA
  })
}