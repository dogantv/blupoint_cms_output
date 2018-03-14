import { setTokenToCookie, getTokenFromCookie, extractUserFromToken } from '~/helpers/auth'

const refreshToken = async function (app, token) {
  let {data} = app.$axios.post(`/api/tokens/refresh`, {'token': token})
  return data.token
}

const check = async function (app, req) {
  const token = getTokenFromCookie(req)
  const extractToken = extractUserFromToken(token)

  if (!extractToken) throw new Error('Authorization Error')

  const exp = extractToken.exp * 1000
  const now = Date.now()
  const fiveMinutes = 9 * 60 * 1000
  if (exp <= now) throw new Error('Authorization Error')
  if ((exp - fiveMinutes) < now) {
    try {
      const newToken = await refreshToken(app, token)
      return newToken
    } catch (e) {
      throw new Error('Authorization Error')
    }
  } else {
    return token
  }
}

export default async ({app, store, req, res, redirect}) => {
  try {
    let token = await check()
    if (getTokenFromCookie(req) !== token) setTokenToCookie(token, res)
  } catch (e) {
  }
}
