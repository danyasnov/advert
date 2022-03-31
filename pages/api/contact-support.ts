import type {NextApiRequest, NextApiResponse} from 'next'
import {API_URL, makeRequest} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const {message} = body
  console.log(JSON.stringify({message, app_id: 'web'}))
  return makeRequest({
    data: `query=${JSON.stringify({message, app_id: 'web'})}`,
    method: 'post',
    url: `${API_URL}/v1/contact_support.php`,
  }).then((response) => {
    return res.json(response.data)
  })
}
