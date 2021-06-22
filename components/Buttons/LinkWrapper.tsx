import {FC, ReactNode} from 'react'
import Link from 'next/link'

interface Props {
  href: string
  children: ReactNode
  className?: string
}

const LinkWrapper: FC<Props> = ({href, children, className}) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        className={`capitalize-first whitespace-nowrap text-body-3 text-brand-b1
      ${className || ''}`}>
        {children}
      </a>
    </Link>
  )
}
export default LinkWrapper
