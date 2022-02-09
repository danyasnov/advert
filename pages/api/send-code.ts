import type {NextApiRequest, NextApiResponse} from 'next'
import {AuthType} from 'front-api/src/models'
import {API_URL, makeRequest} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  const {type, incoming} = body
  const params = type === AuthType.phone ? {num: incoming} : {email: incoming}
  return makeRequest({
    data: `query=${JSON.stringify(params)}`,
    method: 'post',
    url: `${API_URL}/v1/sendAuthSmsUser_2390cf0ufjdsklfjmckas.php`,
  }).then((response) => {
    return res.json(response.data)
  })
}
