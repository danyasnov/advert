import type {NextApiRequest, NextApiResponse} from 'next'
import {AxiosResponse} from 'axios'
import {makeRequest} from '../../api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<AxiosResponse> => {
  const {body} = req

  return makeRequest({
    url: 'https://api.sparkpost.com/api/v1/transmissions?num_rcpt_errors=3',
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'ec77f25d7cd710e17af25ebd9beb3b7221c13e24',
    },
    data: {
      campaign_id: 'postman_inline_both_example',
      recipients: [
        {
          address: 'yasnov.one@gmail.com',
        },
      ],
      content: {
        from: {
          email: 'landing@adverto.sale',
          name: 'Merchant Landing',
        },

        subject: 'New application from Merchant Landing',
        html: `<html>
              <body>
              Name: ${body.name}<br>
              Category: ${body.category}<br>
              Business name: ${body.business_name}<br>
              Email: ${body.email}<br>
              Phone: ${body.phone}<br>
              </body>
              </html>`,
      },
    },
  })
}
