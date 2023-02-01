import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'
import jwtDecode from 'jwt-decode'
import axios from 'axios'
import {API_URL, makeRequest} from './api'

export async function middleware(request: NextRequest) {
  console.log('middleware')
  const response = NextResponse.next()

  const authNewToken = request.cookies.get('authNewToken')
  if (!authNewToken) {
    return response
  }
  let decoded
  try {
    decoded = jwtDecode(authNewToken)
  } catch (e) {
    console.error(e)
  }
  if (!decoded) {
    return response
  }
  const date = new Date()
  // @ts-ignore
  const exp = decoded.exp * 1000
  if (exp > date.valueOf()) {
    return response
  }
  console.log('need refresh')
  const authNewRefreshToken = request.cookies.get('authNewRefreshToken')

  const loginUrl = new URL('/login', request.url)
  if (!authNewRefreshToken) {
    return NextResponse.redirect(loginUrl)
  }
  let refreshData
  try {
    const refreshResponse = await fetch(`${API_URL}/v2/auth/token/refresh`, {
      method: 'post',
      body: JSON.stringify({
        data: {
          token: authNewRefreshToken,
        },
      }),
    })
    refreshData = await refreshResponse.json()
  } catch (e) {
    console.error(e)
  }

  if (refreshData?.newAuth?.access && refreshData?.newAuth?.refresh) {
    console.log('refreshData.access', refreshData.newAuth)
    const options = {
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    }
    response.cookies.set('authNewToken', refreshData.newAuth.access, options)
    response.cookies.set(
      'authNewRefreshToken',
      refreshData.newAuth.refresh,
      options,
    )
  } else {
    response.cookies.delete('authNewToken')
    response.cookies.delete('authNewRefreshToken')
    console.log('redirect to login', refreshData)
    // return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
}
