import type {NextApiRequest, NextApiResponse} from 'next'
import {AxiosResponse} from 'axios'
import {makeRequest} from '../../api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const {body} = req

  makeRequest({
    url: 'https://api.sparkpost.com/api/v1/transmissions?num_rcpt_errors=3',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'a559cdf560e7936ffb90fb5765d95c3a110087ad',
    },
    data: {
      campaign_id: 'postman_inline_both_example',
      recipients: [
        {
          address: 'sales@vooxee.com',
        },
        {
          address: 'info@vooxee.com',
        },
      ],
      content: {
        from: {
          email: 'info@vooxee.com',
          name: 'info@vooxee.com',
        },

        subject: 'New application from Business Landing',
        html: `<html>
              <body>
              Name: ${body.name}<br>
              Business name: ${body.business_name}<br>
              Email: ${body.email}<br>
              Phone: ${body.phone}<br>
              </body>
              </html>`,
      },
    },
  }).then((data) => {
    console.log(data)
    res.json(data.data)
  })
}
