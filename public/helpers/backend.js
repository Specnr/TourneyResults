export const strTimeToSecs = (strTime) => {
  const [mins, secs] = strTime.split(":")
  return parseInt(mins)*60 + parseInt(secs)
}

export const byRoundTabulation = (data) => {
  const roundData = {}
  if (data.length > 0) {
    Object.keys(data[0]).forEach((key, idx) => {
      if (key !== "name") {
        roundData[key] = [...data].sort((a, b) => {
          const [a1, b1] = [a[key], b[key]]
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

export const overallTabulation = (data) => {

}