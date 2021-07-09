import {FC, ReactNode} from 'react'
import Link from 'next/link'

interface Props {
  href: string
  children: ReactNode
  className?: string
  target?: '_self' | '_blank'
}

const LinkWrapper: FC<Props> = ({
  href,
  children,
  className,
  target = '_self',
}) => {
  return (
    <Link href={href}>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <a
        target={target}
        className={`capitalize-first text-body-3 text-brand-b1
      ${className || ''}`}>
        {children}
      </a>
    </Link>
  )
}
export default LinkWrapper
