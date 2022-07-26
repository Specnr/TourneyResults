import { useState } from "react"
import { Table } from "react-bootstrap"
import Select from "react-select"

import { secondsToVisual, placeToColor, ordinalSuffix } from "../public/helpers/frontend"

const ByRoundView = ({data}) => {
  const [round, setRound] = useState("Round 1")
  const rounds = Object.keys(data).map(key => ({label: key, value: key}))

  return (
    <>
      <Select
        styles={{
          option: (provided) => ({
            ...provided,
            color: "black",
          }),
          placeholder: (provided) => ({
            ...provided,
            padding: "0.275rem 0"
          })
        }}
        options={rounds}
        placeholder="Select a round..."
        onChange={item => setRound(item.value)}
      />
      <Table className="my-4" style={{fontSize: "1.35em"}} responsive bordered hover variant="light">
        <thead>
          <tr>
            <th>Place</th>
            <th>Player</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {
            data[round].map((val, idx) => {
              const style = {
                color: idx < 3 && val[round] !== -1 && placeToColor(idx),
                fontWeight: idx < 3 && val[round] !== -1 && "bold",
                fontStyle: idx < 3 && val[round] !== -1 && "italic"
              }
              return (
              <tr key={idx}>
                <td style={style}>{ordinalSuffix(idx + 1)}</td>
                <td style={style}>{val.name}</td>
                <td>{secondsToVisual(val[round])}</td>
              </tr>
            )})
          }
        </tbody>
      </Table>
    </>
  )
}

export default ByRoundView