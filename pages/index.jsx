import { Col, Row, Spinner } from "react-bootstrap"
import { useState } from 'react';
import Router from "next/router"
import Select from "react-select"
const axios = require("axios")

const Home = () => {
  const [data, setData] = useState({})

  const doSearch = (item) => {
    if (item !== "")
      Router.push(`/tourney/${item}`)
  }

  if (!data.data) {
    axios.get('/api/alltourneys').then(res => setData(res.data))
    return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
  }
  
  return (
    <>
      <Row style={{minHeight: "25vh"}}>
        <Col>
          <h1 style={{fontSize: "12vh"}}>
            Top Runner Tournament
          </h1>
        </Col>
      </Row>
      <Row style={{minHeight: "10vh", textAlign: "left"}}>
        <Col>
          <Select
            styles={{
              option: (provided) => ({
                ...provided,
                color: "black",
                fontSize: "1.2rem"
              }),
              placeholder: (provided) => ({
                ...provided,
                fontSize: "2rem",
                padding: "0.275rem 0"
              }),
              singleValue: (provided) => ({
                ...provided,
                fontSize: "2rem"
              }),
              input: (provided) => ({
                ...provided,
                fontSize: "2rem"
              }),
            }}
            options={data.data}
            placeholder="Select a tourney..."
            onChange={item => doSearch(item.value)}
          />
        </Col>
      </Row>
    </>
  )
}

export default Home