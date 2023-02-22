import { Col, Row } from "react-bootstrap"
import Router from "next/router"
import Select from "react-select"
const axios = require("axios")

const Home = ({data}) => {
  const doSearch = (item) => {
    if (item !== "")
      Router.push(`/${item}`)
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
            onChange={item => doSearch(item.label)}
          />
        </Col>
      </Row>
    </>
  )
}

export const getServerSideProps = async () => {
  const host = `https://${process.env.VERCEL_URL}`
  const rawData = await axios.get(`${host}/api/alltourneys`)
  return {
    props: { data: rawData.data }
  }
}

export default Home