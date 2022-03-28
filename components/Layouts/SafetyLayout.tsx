import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'

const SafetyLayout: FC = observer(() => {
  const {t} = useTranslation()
  return (
    <div>
      <div>
        <Logo />
        <LanguageSelect />
      </div>
    </div>
  )
})

export default SafetyLayout
