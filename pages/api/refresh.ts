import type {NextApiRequest, NextApiResponse} from 'next'
import {API_URL, makeRequest} from '../../api'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {body} = req
  return makeRequest({
    url: `${API_URL}/v2/auth/token/refresh`,
    method: 'post',
    data: {
      data: {
        token: body.authNewRefreshToken,
      },
    },
  }).then((response) => {
    res.json(response.data)
  })
}
