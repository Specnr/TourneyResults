import { useRouter } from 'next/router'
import Router from "next/router"
import { Spinner} from 'react-bootstrap'

const ToruneyRedirect = () => {
  const router = useRouter()
  const { tourney } = router.query
  if (!tourney)
    return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
  // Make sure tourney exists in db
  fetch(`/api/${tourney.toLowerCase()}`)
  .then(res => res.json())
  .then(res => {
    if (res.success && res.sheetId.length > 0)
      Router.push(`/tourney/${res.sheetId}`)
    else
      Router.push(`/`)
  })
  return <Spinner animation="border" style={{minHeight: "2em", minWidth: "2em", fontSize: "2em"}} />
}

export default ToruneyRedirect