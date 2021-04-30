import { AccountBalanceWallet, ExitToApp } from '@material-ui/icons'
import { FC } from 'react'
import ButtonWithIcon from './ButtonWithIcon'
import CategoriesButton from './CategoriesButton'
import Logo from './Logo'
import Search from './Search'

const Header: FC = () => {
    return (
        <>
            <div className="flex justify-between px-16 py-8 border-b border-shadow-b">
                <ButtonWithIcon label="кошелек">
                    <AccountBalanceWallet
                        style={{ fontSize: 12 }}
                        className="mr-8"
                    />
                </ButtonWithIcon>
                <ButtonWithIcon label="вход">
                    <ExitToApp style={{ fontSize: 12 }} className="mr-8" />
                </ButtonWithIcon>
            </div>
            <div className="flex my-8 mx-16">
                <Logo />
                <CategoriesButton />
                <Search />
            </div>
        </>
    )
}

export default Header
