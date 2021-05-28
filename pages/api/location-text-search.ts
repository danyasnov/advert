import axios from 'axios'
import type {NextApiRequest, NextApiResponse} from 'next'

export default (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const {query} = req
  return new Promise((resolve) =>
    axios
      .get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          key: process.env.GOOGLE_API,
          input: query.query,
          language: 'ru',
        },
      })
      .then(({data}) => {
        res.json(data)
        return resolve()
      }),
  )
}
