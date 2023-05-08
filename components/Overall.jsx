import { Table } from "react-bootstrap"

import { secondsToVisual, placeToColor, ordinalSuffix } from "../public/helpers/frontend"

const ByRoundView = ({ data, rounds, isNew }) => {
  return (
    <Table className="my-4" style={{fontSize: "1.35em"}} responsive bordered hover variant="light">
      <thead>
        <tr>
          <th>Place</th>
          <th>Player</th>
          {
            rounds.map((r, i) => {
              if (r.label !== "name") {
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
            data.map((player, i) => {
              const placementStyle = {
                color: placeToColor(i),
                fontWeight: i < 3 ? "bold" : "",
                fontStyle: i < 3 ? "italic" : ""
              }
              let needsRedDNF = !rounds.reduce((t, c) => c.value.startsWith("Round") ? t && player.hasOwnProperty(c.value) : t, true)
              return (
                <tr key={i}>
                  <td style={placementStyle}>{ordinalSuffix(i + 1)}</td>
                  <td style={i < 3 ? placementStyle : null}>{player.name}</td>
                  { 
                    rounds.map((r, j) => {
                      const slowestStyle = {
                        color: "red"
                      }
                      let showRedDNF = false
                      if (needsRedDNF && !player.hasOwnProperty(r.value)) {
                        showRedDNF = true
                        needsRedDNF = false
                      }
                      return (
                        <td style={player[r.value] < -1 || showRedDNF ? slowestStyle : null} key={`${i}-${j}`}>
                          {player.hasOwnProperty(r.value) && player[r.value] !== -1 ? secondsToVisual(Math.abs(player[r.value]), isNew) : "DNF"}
                        </td>
                      )
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