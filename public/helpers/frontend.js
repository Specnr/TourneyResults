export const fetcher = url => fetch(url).then((res) => res.json());

export const secondsToVisual = secs => {
  if (secs === -1)
    return "DNF"
  const timeDate = new Date(secs * 1000)
  return `${timeDate.getMinutes()}:${timeDate.getSeconds()}`
}