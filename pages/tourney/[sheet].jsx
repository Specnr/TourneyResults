import { Spinner, Tabs, Tab } from 'react-bootstrap'
import ByRoundView from '../../components/ByRound';
import OverallView from '../../components/Overall';
const axios = require("axios")

const TourneyPage = ({data}) => {
  return (
    <div className='container mt-4'>
      <h1 className='display-1'>Top Runner Tournament</h1>
      <Tabs transition={false}>
        <Tab eventKey="overall" title="Overall">
          <h1 className="display-2">Overall</h1>
          <OverallView data={data.overall} />
        </Tab>
        <Tab eventKey="round" title="By Round">
          <h1 className="display-2">By Round</h1>
          <ByRoundView data={data.byRound} />
        </Tab>
      </Tabs>
    </div>
  )
}

export const getServerSideProps = async (context) => {
  const host = process.env.NODE_ENV === "development" ? "http://localhost:3000" : `https://${process.env.VERCEL_URL}`
  const rawData = await axios.get(`${host}/api/tourney/${context.query.sheet}`)
  return {
    props: { data: rawData.data }
  }
}

export default TourneyPage