import { MongoClient } from 'mongodb'
import { uuidToUsername } from "../minecraftAPI"
import { overallTabulation, byRoundTabulation } from "../backend"

const roundsCol = new MongoClient(process.env.MONGO_URI).db().collection('Rounds')
const subCol = new MongoClient(process.env.MONGO_URI).db().collection('Submissions')

const roundNumberToText = (round, roundList) => {
  const foundRound = roundList.filter(r => r.order === round);
  if (foundRound.length === 0) return "???"

  return foundRound[0].name
}

export const tabulateResults = async tourney => {
  const rounds = await roundsCol.find({}).toArray()
  const subs = await subCol.find({}).toArray()

  let userData = {}
  const seedRoundMap = {}
  rounds.forEach(round => seedRoundMap[round.order] = round)

  subs.forEach(sub => {
    if (sub.uuid === "") return
    const round = roundNumberToText(sub.round, rounds)
    if (round === "???") return

    if (!userData.hasOwnProperty(sub.uuid)) {
      userData[sub.uuid] = { slowest: { name: round, time: sub.time } }
    } else {
      if (seedRoundMap[sub.round].name.startsWith("Round") && sub.time > userData[sub.uuid].slowest.time) {
        userData[sub.uuid].slowest = { name: round, time: sub.time }
      }
    }
    userData[sub.uuid][round] = sub.time
  })

  for (const uuid in userData) {
    const qualsFinished = Object.keys(userData[uuid]).reduce((t, c) => t + (c.startsWith("Round")), 0)
    if (qualsFinished === 5) {
      userData[uuid][userData[uuid].slowest.name] *= -1
    }
    delete userData[uuid].slowest
  }

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