export const fetcher = url => fetch(url).then((res) => res.json());

const roundPriority = ["GF", "F", "T8", "SF", "T16", "QF", "T32", "TQ"]
export const roundsSort = (a, b) => {
  for (const round of roundPriority) {
    if (a.value.startsWith(round) && !b.value.startsWith(round))
      return 1
    if (!a.value.startsWith(round) && b.value.startsWith(round))
      return -1
    if (a.value.startsWith(round) && b.value.startsWith(round)) {
      if (a.value > b.value)
        return 1
      if (a.value < b.value)
        return -1
      return 0
    }
  }
  if (a.value > b.value)
    return 1
  if (a.value < b.value)
    return -1
  return 0
}

export const secondsToVisual = (secs, isNew) => {
  if (secs === -2)
    return "Finish"
  if (secs === -1)
    return "DNF"
  const timeDate = new Date(isNew ? secs : secs * 1000)
  const s = timeDate.getSeconds()
  return `${timeDate.getMinutes()}:${s < 10 ? `0${s}` : s}`
}

export const placeToColor = place => {
  if (place === 0)
    return "goldenrod"
  if (place === 1)
    return "#929292"
  if (place === 2)
    return "#cd7f32"
  if (place < 32)
    return "#228B22"
}

// https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number
export const ordinalSuffix = i => {
  const j = i % 10, k = i % 100
  if (j === 1 && k !== 11)
    return i + "st"
  if (j === 2 && k !== 12)
    return i + "nd"
  if (j === 3 && k !== 13)
    return i + "rd"
  return i + "th"
}

export const shortenRoundName = name => {
  if (name.startsWith("T"))
    return name

  if (name.startsWith("GF"))
    return `GF${name.substr(name.length - 1)}`

  return `${name.substr(0, 1)}${name.substr(name.length - 1)}`
}