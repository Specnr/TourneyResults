import { Tabs, Tab } from 'react-bootstrap'
import ByRoundView from '../components/ByRound';
import OverallView from '../components/Overall';
const axios = require("axios")

const TourneyPage = props => {
  if (props.error)
    return <h1>{props.error}</h1>
  return (
    <>
      <div className='container mt-4'>
        <h1 className='display-1'>Top Runner Tournament</h1>
        <h1>{props.data.name}</h1>
        <Tabs transition={false}>
          <Tab eventKey="overall" title="Overall">
            <h1 className="display-2">Overall</h1>
            <OverallView data={props.data.overall} roundsOverride={roundsOverride} />
          </Tab>
          <Tab eventKey="round" title="By Round">
            <h1 className="display-2">By Round</h1>
            <ByRoundView data={props.data.byRound} roundsOverride={roundsOverride} />
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
  const host = `http://localhost:3000`
  const rawData = await axios.get(`${host}/api/tourney/${context.query.tourney}`)
    .catch(err => console.log(err))

  if (rawData) {
    return {
      props: { data: rawData.data, roundsOverride: !rawData.data.hasOwnProperty("sheetId")  }
    }
  } else {
    return {
      props: { error: `Cannot find tournament ${context.query.tourney}` }
    }
  }
}

export default TourneyPage