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
      Authorization: '',
    },
    data: {
      campaign_id: 'postman_inline_both_example',
      recipients: [
        {
          address: 'marketing@vooxee.com',
        },
      ],
      content: {
        from: {
          email: 'feedback@vooxee.com',
          name: 'Web Support',
        },

        subject: 'New application from web support form',
        html: `<html>
              <body>
              Name: ${body.name}<br>
              Phone: ${body.phone}<br>
              Email: ${body.email}<br>
              Message: ${body.message}<br>
              </body>
              </html>`,
      },
    },
  })
}
