import { SvgIcon } from '@material-ui/core'
import { FC } from 'react'
import CategoriesClosedIcon from '../assets/icons/CategoriesClosedIcon.svg'

const CategoriesButton: FC = () => {
    return (
        <div className="bg-black-c w-40 h-40 rounded-8 flex justify-center items-center ml-16 flex-shrink-0">
            <SvgIcon
                component={CategoriesClosedIcon}
                viewBox="0 0 24 24"
                style={{ fontSize: 24, fill: 'none' }}
            />
        </div>
    )
}
export default CategoriesButton
