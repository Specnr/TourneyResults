import { MongoClient } from 'mongodb'
const resultsCol = new MongoClient(process.env.MONGO_URI).db().collection('Results')

export const readDataFromCache = name => resultsCol.findOne({ name })

export const writeDataToCache = (name, data) => (resultsCol.updateOne({ name }, { $set: { ...data, timestamp: (new Date()).getTime() } }, { upsert: true }))

export const strTimeToSecs = (strTime) => {
  const [mins, secs] = strTime.split(":")
  return parseInt(mins) * 60 + parseInt(secs)
}

const getAllCompletedRounds = data => {
  const roundsSet = new Set()
  data.forEach(player => {
    Object.keys(player).forEach(key => {
      if (key !== "name" && !roundsSet.has(key))
        roundsSet.add(key)
    })
  })
  return roundsSet.toArray()
}

export const byRoundTabulation = data => {
  const roundData = {}
  data.forEach(player => {
    Object.keys(player).forEach(round => {
      if (round === "name")
        return
      if (!roundData.hasOwnProperty(round))
        roundData[round] = []
      // Could append in order using binary search so we dont need to sort later
      // Would make it O(players * rounds * log(rounds)) instead of O(rounds * (players + log(rounds)))
      roundData[round].push({ name: player.name, time: player[round] })
    })
  })
  Object.keys(roundData).forEach(round => {
    roundData[round]
      .sort((a, b) => {
        const [a1, b1] = [a.time, b.time]
        if (a1 === -1)
          return 1
        if (b1 === -1)
          return -1
        return a1 - b1
      })
  })
  return roundData
}

const MAX_GF_ROUNDS = 5

const completedRuns = player => Object.values(player).length - 1
const completedFinals = player => Object.keys(player).reduce((t, c) => t + (!c.startsWith("Round")), -1)
const completedRounds = player => Object.keys(player).reduce((t, c) => t + (c.startsWith("Round")), 0)
const hasCompletedRound = (player, round) => player.hasOwnProperty(round)
const sumOfTimes = player => Object.values(player).reduce((t, c) => t + (Number.isInteger(c) && c > 0 ? c : 0), 0)
const sumOfFinalsTimes = player => Object.keys(player).reduce((t, c) => t + (!c.startsWith("Round") && Number.isInteger(player[c]) ? player[c] : 0), 0)

export const overallTabulation = (data) => {
  return [...data].sort((a, b) => {
    const [compFinalsA, compFinalsB] = [completedFinals(a), completedFinals(b)]

    // Prioritize finalists
    for (let i = MAX_GF_ROUNDS; i > 0; i--) {
      const roundTxt = `GF Round ${i}`
      if (hasCompletedRound(a, roundTxt) && !hasCompletedRound(b, roundTxt))
        return -1
      if (hasCompletedRound(b, roundTxt) && !hasCompletedRound(a, roundTxt))
        return 1
    }
    if (hasCompletedRound(a, "SF") && !hasCompletedRound(b, "SF"))
      return -1
    if (hasCompletedRound(b, "SF") && !hasCompletedRound(a, "SF"))
      return 1
    if (hasCompletedRound(a, "QF") && !hasCompletedRound(b, "QF"))
      return -1
    if (hasCompletedRound(b, "QF") && !hasCompletedRound(a, "QF"))
      return 1

    if (compFinalsA === compFinalsB && compFinalsA > 0)
      return sumOfFinalsTimes(a) - sumOfFinalsTimes(b)
    
    let [compA, compB] = [completedRuns(a), completedRuns(b)]
    let [compRoundsA, compRoundsB] = [completedRounds(a), completedRounds(b)]
    let [sumA, sumB] = [sumOfTimes(a), sumOfTimes(b)]

    // Drop lowest round if DNF, lowest time is dropped if comp = 5
    if (compRoundsA < 5) compA += 1
    if (compRoundsB < 5) compB += 1

    if (compA === compB)
      return sumA - sumB

    return compB - compA
  })
}