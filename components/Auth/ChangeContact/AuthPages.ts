import EnterPhone from './EnterPhone'
import EnterCode from './EnterCode'
import Success from '../Success'
import EnterEmail from './EnterEmail'

const AuthPages = {
  enterPhone: {
    title: 'LOGIN_WITH_PHONE',
    component: EnterPhone,
  },
  enterEmail: {
    title: 'LOGIN_WITH_EMAIL',
    component: EnterEmail,
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
