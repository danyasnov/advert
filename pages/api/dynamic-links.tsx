import type {NextApiRequest, NextApiResponse} from 'next'
import {FirebaseDynamicLinks} from 'firebase-dynamic-links'
import {CoverLinkType} from 'front-api/src/models/index'
import {processCookies} from '../../helpers'
import {restCoverLink} from '../../api/v1'

const firebaseDynamicLinks = new FirebaseDynamicLinks(
  'AIzaSyAkw1JlCOKOU-AIsBfpl3onL0m46DaydRQ',
)
const generateHashLink = () => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let randomString = ''
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 7; i++) {
    const randomPoz = Math.floor(Math.random() * charSet.length)
    randomString += charSet.substring(randomPoz, randomPoz + 1)
  }
  return randomString
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  const {body} = req
  const state = await processCookies({req})

  const {productHash, userHash} = body
  let type
  let testStr
  const hashLink = generateHashLink()

  if (productHash && userHash) {
    type = CoverLinkType.shareAdvert
    testStr = `https://adverto.sale/${productHash}?action=advert&id=${productHash}&dynamic_link_refer_hash=${hashLink}&user=${userHash}`
  } else if (userHash) {
    type = CoverLinkType.shareOtherProfile
    testStr = `https://adverto.sale/user/${userHash}?action=profile&id=${userHash}&dynamic_link_refer_hash=${hashLink}`
  }

  const {shortLink} = await firebaseDynamicLinks.createLink({
    dynamicLinkInfo: {
      domainUriPrefix: 'https://ca67r.app.goo.gl',
      link: testStr,
      androidInfo: {
        androidPackageName: 'adverto.sale',
      },
      iosInfo: {
        iosBundleId: 'id1287862488',
      },
    },
  })

  const result = await restCoverLink(shortLink, hashLink, type, state.language)
  return res.json(result)
}
