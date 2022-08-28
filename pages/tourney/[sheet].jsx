import { useRouter } from 'next/router'
import { useState } from 'react';
import { Spinner, Tabs, Tab } from 'react-bootstrap'
import ByRoundView from '../../components/ByRound';
import OverallView from '../../components/Overall';
const axios = require("axios")

const TourneyPage = () => {
  const [data, setData] = useState({})
  const router = useRouter()
  const { sheet } = router.query
  if (!data.overall && sheet)
    axios.get(`/api/tourney/${sheet}`).then(res => setData(res.data))

  if (!data.overall) return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
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

export default TourneyPage