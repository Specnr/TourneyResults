import { MongoClient } from 'mongodb'
import { uuidToUsername } from "../minecraftAPI"
import { overallTabulation, byRoundTabulation } from "../backend"

const seedsCol = new MongoClient(process.env.MONGO_URI).db().collection('Seeds')
const subCol = new MongoClient(process.env.MONGO_URI).db().collection('Submissions')

const roundNumberToText = round => {
  let roundTxt;
  if (round > 0) {
    roundTxt = `Round ${round}`
  } else {
    if (round === -1)
      roundTxt = "QF"
    else if (round === -2)
      roundTxt = "SF"
    else if (round <= -3)
      roundTxt = `GF Round ${Math.abs(round) - 2}`
    else
      roundTxt = "???"
  }
  return roundTxt
}

export const tabulateResults = async tourney => {
  const seeds = await seedsCol.find({}).toArray()
  const subs = await subCol.find({}).toArray()

  const userData = {}
  const seedRoundMap = {}
  seeds.forEach(seed => seedRoundMap[seed.seed] = seed.round)

  subs.forEach(sub => {
    if (!userData.hasOwnProperty(sub.uuid)) {
      userData[sub.uuid] = {}
    }
    let round = roundNumberToText(seedRoundMap[sub.seed])
    userData[sub.uuid][round] = sub.time
  })

  const frmtData = await Promise.all(Object.keys(userData).map(async uuid => {
    let x = await uuidToUsername(uuid)
    return ({
      name: x ? (x).data.name : "error",
      ...(userData[uuid])
    })
  }))
  
  const overall = overallTabulation(frmtData)
  const byRound = byRoundTabulation(frmtData)

  return { byRound, overall, name: tourney }
}