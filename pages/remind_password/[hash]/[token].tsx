import {GetServerSideProps} from 'next'
import {fetchUser, setUserPass} from '../../../api/db'
import {randomString} from '../../../utils'

export default function Home() {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {query} = ctx
  const {hash, token} = query
  const user = (await fetchUser(hash as string))[0]
  const salt = `rem_pswd_342532534${user.hash}${user.lang}32if09j2f$$@`
  if (salt === token) {
    const newPass = randomString(8)
    setUserPass(hash as string, newPass)
    return {
      redirect: {
        destination: '/?success=MESSAGE_WAS_SENT',
        statusCode: 301,
      },
    }
  }
  return {
    redirect: {
      destination: '/',
      statusCode: 301,
    },
  }
}
