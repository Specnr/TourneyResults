export const strTimeToSecs = (strTime) => {
  const [mins, secs] = strTime.split(":")
  return parseInt(mins)*60 + parseInt(secs)
}