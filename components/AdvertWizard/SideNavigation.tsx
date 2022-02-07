import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import LinkButton from '../Buttons/LinkButton'
import SecondaryButton from '../Buttons/SecondaryButton'

interface Props {
  items: {title: string; ref: HTMLElement}[]
  onSaveDraft: () => void
}
const SideNavigation: FC<Props> = ({items, onSaveDraft}) => {
  const {t} = useTranslation()
  return (
    <div className='flex flex-col items-start space-y-4 fixed'>
      {items.map((i) => (
        <LinkButton
          key={i.title}
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
      <SecondaryButton onClick={onSaveDraft}>{t('SAVE')}</SecondaryButton>
    </div>
  )
}

export default SideNavigation
