import type {NextApiRequest, NextApiResponse} from 'next'
import {CoverLinkType} from 'front-api/src/models'
import {processCookies} from '../../helpers'
import {restCoverLink} from '../../api/v1'
import {getRest} from '../../api'
import Storage from '../../stores/Storage'

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  const {productHash, userHash} = body
  let type
  let link
  const storage = new Storage({})
  const rest = getRest(storage)
  const linkHash = rest.deeplinkUtils.generateDeeplinkHash()

  if (productHash && userHash) {
    type = CoverLinkType.shareAdvert
    link = rest.deeplinkUtils.generateProductLink(
      linkHash,
      productHash,
      userHash,
    )
  } else if (userHash) {
    type = CoverLinkType.shareOtherProfile
    link = rest.deeplinkUtils.generateUserLink(linkHash, userHash)
  }

  const result = await restCoverLink(link, linkHash, type, state.language)
  return res.json(result)
}
