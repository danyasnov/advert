import { FC } from 'react'

interface IProps {
    label: string
    children: JSX.Element
}
const ButtonWithIcon: FC<IProps> = ({ label, children }) => {
    return (
        <button
            type="button"
            className="text-body-3 font-normal text-brand-b1 flex items-center capitalize"
        >
            {children}
            {label}
        </button>
    )
}
export default ButtonWithIcon
