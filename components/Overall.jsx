import { Table } from "react-bootstrap"

import { secondsToVisual, placeToColor, ordinalSuffix } from "../public/helpers/frontend"

const ByRoundView = ({data}) => {
  const rounds = Object.keys(data[0]).map(key => ({label: key, value: key}))
  return (
    <Table className="my-4" style={{fontSize: "1.35em"}} responsive bordered hover variant="light">
      <thead>
        <tr>
          <th>Place</th>
          <th>Player</th>
          {
            rounds.map((r, i) => {
              if (i !== 0) {
                return (
                  <th key={i}>
                    {r.label}
                  </th>
                )
              }
            })
          }
        </tr>
      </thead>
      <tbody>
          {
            data.map((val, idx) => {
              const style = {
                color: placeToColor(idx),
                fontWeight: idx < 3 ? "bold" : "",
                fontStyle: idx < 3 ? "italic" : ""
              }
              return (
                <tr key={idx}>
                  <td style={style}>{ordinalSuffix(idx + 1)}</td>
                  {
                    Object.values(val).map((vVal, j) => {
                      if (j === 0)
                        return <td style={style} key={`${idx}-${j}`}>{vVal}</td>
                      return <td key={`${idx}-${j}`}>{secondsToVisual(vVal)}</td>
                    })
                  }
                </tr>
              )
            })
          }
      </tbody>
    </Table>
  )
}

export default ByRoundView