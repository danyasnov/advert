import {FC} from 'react'
import LinkButton from '../Buttons/LinkButton'

interface Props {
  items: {title: string; ref: HTMLElement}[]
}
const SideNavigation: FC<Props> = ({items}) => {
  return (
    <div className='flex flex-col items-start space-y-4 fixed'>
      {items.map((i) => (
        <LinkButton
          onClick={() => {
            i.ref.scrollIntoView({behavior: 'smooth'})
          }}>
          <span className='rounded-full bg-brand-b1 w-1 h-1 mr-4' />
          <span
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'dotted',
            }}
            className='text-body-1'>
            {i.title}
          </span>
        </LinkButton>
      ))}
    </div>
  )
}

export default SideNavigation
