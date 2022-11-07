import type {NextApiRequest, NextApiResponse} from 'next'
import {getStorageFromCookies} from '../../helpers'
import {getRest} from '../../api'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const storage = getStorageFromCookies({req, res})

  const {productHash, userHash} = body
  let link
  const rest = getRest(storage)
  const linkHash = rest.deeplinkUtils.generateDeeplinkHash()

  if (productHash) {
    link = rest.deeplinkUtils.generateProductLink(
      linkHash,
      productHash,
      userHash,
    )
  } else if (userHash) {
    link = rest.deeplinkUtils.generateUserLink(linkHash, userHash)
  }

  return res.json(link)
}
