import { useRouter } from 'next/router'
import { Spinner, Tabs, Tab } from 'react-bootstrap'
import useSWR from "swr"
import ByRoundView from '../../components/ByRound';
import OverallView from '../../components/Overall';
import { fetcher } from '../../public/helpers/frontend';

const TourneyPage = () => {
  const router = useRouter()
  const { sheet } = router.query
  const { data, error } = useSWR(sheet ? `/api/tourney/${sheet}` : null, fetcher);

  if (error) return "An error has occurred."
  if (!data) return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
  if (!data.success) return <h1>Invalid tourney :(</h1>
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