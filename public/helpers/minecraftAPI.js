const axios = require("axios")
const MC_API = "https://sessionserver.mojang.com/session/minecraft/profile/"

export const uuidToUsername = uuid => axios.get(`${MC_API}${uuid}`).then(res => res.data.name)