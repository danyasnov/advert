/* eslint-disable jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import {FC, ReactNode} from 'react'
import Link from 'next/link'

interface Props {
  href: string
  children: ReactNode
  className?: string
  id?: string
  title: string
  target?: '_self' | '_blank'
  preventDefault?: boolean
  handleClick?: () => void
}

const LinkWrapper: FC<Props> = ({
  href,
  children,
  className,
  title,
  id,
  preventDefault,
  target = '_self',
  handleClick,
}) => {
  return (
    <Link href={href}>
      <a
        data-test-id={id}
        target={target}
        title={title}
        className={className || ''}
        onClick={(e) => {
          if (preventDefault) e.preventDefault()
          if (handleClick) handleClick()
        }}>
        {children}
      </a>
    </Link>
  )
}
export default LinkWrapper
