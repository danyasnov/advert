import axios from 'axios'
import type {NextApiRequest, NextApiResponse} from 'next'
import {globalRestApi} from '../index'

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const {body} = req
  axios.get('https://api.adverto.sale/v2/geo/mylocation').then(({data}) => {
    res.json(data)
  })
}
