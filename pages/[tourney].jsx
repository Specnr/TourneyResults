import { Tabs, Tab } from 'react-bootstrap'
import ByRoundView from '../components/ByRound';
import OverallView from '../components/Overall';
import { roundsSort } from "../public/helpers/frontend"
const axios = require("axios")

const TourneyPage = props => {
  if (props.error)
    return <h1>{props.error}</h1>
  if (props.data.overall.length === 0)
    return <h1>No submissions yet</h1>
  return (
    <>
      <div className='container mt-4'>
        <h1 className='display-1'>Top Runner Tournament</h1>
        <h1>{props.data.name}</h1>
        <Tabs transition={false}>
          <Tab eventKey="overall" title="Overall">
            <h1 className="display-2">Overall</h1>
            <OverallView data={props.data.overall} rounds={props.rounds} isNew={props.isNew} />
          </Tab>
          <Tab eventKey="round" title="By Round">
            <h1 className="display-2">By Round</h1>
            <ByRoundView data={props.data.byRound} rounds={props.rounds} isNew={props.isNew} />
          </Tab>
        </Tabs>
      </div>
      <p className="mb-0 text-muted" style={{bottom: "0", left: "0", right: "0"}}>
        Updates every 30 seconds
      </p>
    </>
  )
}

export const getServerSideProps = async (context) => {
  const host = `https://${process.env.VERCEL_URL}`
  const rawData = await axios.get(`${host}/api/tourney/${context.query.tourney}`)
    .catch(err => console.log(err))

  if (rawData) {
    return {
      props: { data: rawData.data,
        isNew: !rawData.data.hasOwnProperty("sheetId"),
        rounds: Object.keys(rawData.data.byRound).map(key => ({ label: key, value: key })).sort(roundsSort)
      }
    }
  } else {
    return {
      props: { error: `Cannot find tournament ${context.query.tourney}` }
    }
  }
}

export default TourneyPage