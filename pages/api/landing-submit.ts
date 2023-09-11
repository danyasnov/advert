import type {NextApiRequest, NextApiResponse} from 'next'
import {AxiosResponse} from 'axios'
import {makeRequest} from '../../api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> => {
  const {body} = req

  const sendingContent = {
    from: {
      email: 'info@vooxee.com',
      name: 'info@vooxee.com',
    },
    subject: '',
    html: '',
  }
  if (body.parameter === 'Royal Gardens') {
    sendingContent.subject = 'New application from Royal Gardens Landing'
    sendingContent.html = `<html>
                      <body>
                      Name: ${body.name}<br>
                      Email: ${body.email}<br>
                      Phone: ${body.phone}<br>
                      Text: ${body.message}<br>
                      </body>
                      </html>`
  } else {
    sendingContent.subject = 'New application from Business Landing'
    sendingContent.html = `<html>
                      <body>
                      Name: ${body.name}<br>
                      Business name: ${body.business_name}<br>
                      Email: ${body.email}<br>
                      Phone: ${body.phone}<br>
                      </body>
                      </html>`
  }
  makeRequest({
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
          address: 'sales@vooxee.com',
        },
        {
          address: 'marketing@vooxee.com',
        },
      ],
      content: sendingContent,
    },
  }).then((data) => {
    console.log(data)
    res.json(data.data)
  })
}
