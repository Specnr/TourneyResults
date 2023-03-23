import { MongoClient } from 'mongodb'
const resultsCol = new MongoClient(process.env.MONGO_URI).db().collection('Results')

export const archiveResult = tourney => resultsCol.updateOne({ name: tourney }, { $set: { isArchived: true } })

export const createResult = async tourney => {
  const quals = 5
  let rounds = {}
  for (let i=1; i<quals+1; i++)
    rounds[`Round ${i}`] = []
  return resultsCol.insertOne({
    byRound: {...rounds, "QF": [], "SF": [], "GF": []},
    overall: [],
    name: tourney,
    timestamp: (new Date()).getTime(),
    isArchived: false
  })
}