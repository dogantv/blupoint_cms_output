import jwtDecode from 'jwt-decode'
import Cookie from 'js-cookie'

export const setTokenToCookie = (token, res) => {
  if (!res) {
    Cookie.set('token', token)
  } else {
    res.set({
      'Set-Cookie': `token=${token}; path=/`
    })
  }
}

export const removeTokenFromCookie = (res) => {
  if (!res) {
    Cookie.remove('token')
  } else {
    res.set({
      'Set-Cookie': `token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    })
  }
}

export const getTokenFromCookie = (req) => {
  let jwtCookie = null
  if (req && req.headers.cookie) {
    jwtCookie = req.headers.cookie.split(';').find(c => c.trim().startsWith('token='))
    if (!jwtCookie) return
    const jwt = jwtCookie.split('=')[1]
    return jwt
  }
  jwtCookie = Cookie.get('token')
  return jwtCookie
}

export const extractUserFromToken = (token) => {
  if (!token) {
    return
  }
  return jwtDecode(token)
}
