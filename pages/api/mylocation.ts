import axios from 'axios'
import type {NextApiRequest, NextApiResponse} from 'next'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  return new Promise((resolve) => {
    axios.get(`${process.env.API_URL}/v2/geo/mylocation`).then(({data}) => {
      res.json(data)
      resolve()
    })
  })
}
