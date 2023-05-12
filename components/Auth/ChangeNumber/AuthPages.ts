import EnterPhone from './EnterPhone'
import EnterCode from './EnterCode'
import Success from '../Success'

const AuthPages = {
  enterPhone: {
    title: 'LOGIN_WITH_PHONE',
    component: EnterPhone,
  },
  enterCode: {
    title: 'CODE',
    component: EnterCode,
  },
  success: {
    title: 'CONGRATULATIONS',
    component: Success,
  },
}
export default AuthPages
