export const fetcher = url => fetch(url).then((res) => res.json());

export const secondsToVisual = secs => {
  if (secs === -2)
    return "Finish"
  if (secs === -1)
    return "DNF"
  const timeDate = new Date(secs * 1000)
  const s = timeDate.getSeconds()
  return `${timeDate.getMinutes()}:${s < 10 ? `0${s}` : s}`
}