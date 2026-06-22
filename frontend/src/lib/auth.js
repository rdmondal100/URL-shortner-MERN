const authTokenKey = "url-shortener-token"
const authUserKey = "url-shortener-user"

export const getAuthToken = () => localStorage.getItem(authTokenKey)

export const getAuthUser = () => {
  const rawUser = localStorage.getItem(authUserKey)
  if (!rawUser) return null

  try {
    return JSON.parse(rawUser)
  } catch {
    return null
  }
}

export const setAuthSession = ({ token, user }) => {
  localStorage.setItem(authTokenKey, token)
  localStorage.setItem(authUserKey, JSON.stringify(user))
}

export const clearAuthSession = () => {
  localStorage.removeItem(authTokenKey)
  localStorage.removeItem(authUserKey)
}

export const getAuthHeaders = () => {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}