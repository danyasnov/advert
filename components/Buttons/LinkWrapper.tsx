import {FC, ReactNode} from 'react'
import Link from 'next/link'

interface Props {
  href: string
  children: ReactNode
  className?: string
  title: string
  target?: '_self' | '_blank'
}

const LinkWrapper: FC<Props> = ({
  href,
  children,
  className,
  title,
  target = '_self',
}) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a target={target} title={title} className={className || ''}>
        {children}
      </a>
    </Link>
  )
}
export default LinkWrapper
