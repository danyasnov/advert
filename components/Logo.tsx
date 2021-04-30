import { SvgIcon } from '@material-ui/core'
import { FC } from 'react'
import AdvertoLogoInverseSquare from '../assets/icons/AdvertoLogoInverseSquare.svg'

const Logo: FC = () => {
    return (
        <>
            <SvgIcon
                component={AdvertoLogoInverseSquare}
                viewBox="0 0 136 136"
                style={{ fontSize: 40 }}
            />
        </>
    )
}

export default Logo
