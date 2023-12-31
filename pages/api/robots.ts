import type {NextApiRequest, NextApiResponse} from 'next'

const locales = ['en', 'el', 'ru', 'uk']

export default (req: NextApiRequest, res: NextApiResponse): void => {
  const {headers} = req
  const {host} = headers
  let subdomain = host ? host.split('.')[0] : ''
  subdomain = locales.includes(subdomain) ? subdomain : ''
  res.write(getRobotTxt(subdomain))
  res.end()
}

const getRobotTxt = (subdomain) => {
  return `User-agent: *
Allow: /
sitemap: https://${
    subdomain ? `${subdomain}.` : ''
  }vooxee.com/sitemaps/sitemap-${subdomain || 'main'}.xml
Disallow: /web-api/
Disallow: /scripts/`
}
