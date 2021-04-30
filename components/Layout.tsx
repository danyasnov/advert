import { FC, ReactNode } from 'react'
import Header from './Header'

interface Props {
    children: ReactNode
}

const Layout: FC = ({ children }: Props) => {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default Layout
