const axios = require("axios")
const MC_API = "https://sessionserver.mojang.com/session/minecraft/profile/"

export const uuidToUsername = uuid => {
  return axios.get(`${MC_API}${uuid}`).catch(err => {data: {name: "error"}})
}