/* eslint-disable jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */
import {FC, ReactNode} from 'react'
import Link from 'next/link'
import {handleMetrics} from '../../helpers'

interface Props {
  href: string
  children: ReactNode
  className?: string
  id?: string
  title: string
  target?: '_self' | '_blank'
  preventDefault?: boolean
  isClicked?: boolean
}

const LinkWrapper: FC<Props> = ({
  href,
  children,
  className,
  title,
  id,
  preventDefault,
  target = '_self',
  isClicked,
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
          if (isClicked) handleMetrics('clickCategory', id)
        }}>
        {children}
      </a>
    </Link>
  )
}
export default LinkWrapper
