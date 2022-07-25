import { useRouter } from 'next/router'
import { Spinner, Tabs, Tab } from 'react-bootstrap'
import useSWR from "swr"
import { fetcher } from '../../public/helpers/frontend';

const TourneyPage = () => {
  const router = useRouter()
  const { sheet } = router.query
  const { data, error } = useSWR(sheet ? `/api/tourney/${sheet}` : null, fetcher);

  if (error) return "An error has occurred."
  if (!data) return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
  if (!data.success) return <h1>Invalid tourney :(</h1>
  return (
    <Tabs transition={false}>
      <Tab eventKey="overall" title="Overall">
        <h1 className="display-2">Overall</h1>
      </Tab>
      <Tab eventKey="round" title="By Round">
        <h1 className="display-2">By Round</h1>
      </Tab>
      <Tab eventKey="player" title="By Player">
        <h1 className="display-2">By Player</h1>
      </Tab>
    </Tabs>
  )
}

export default TourneyPage