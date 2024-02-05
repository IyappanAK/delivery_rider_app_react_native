import { TOKEN_KEY, ORG_KEY } from '@/core/constants/index'
import { removeCookie } from './cookie'
import {
  removeAuthHeader,
  removeOrgHeader,
  setAuthHeader,
  setOrgHeader,
} from '@/core/lib/AxiosClient'
import { ENV } from '@/config/app.config'



export const setPasscode = (value: string) => {
  const cookie = `${TOKEN_KEY}=${value}; domain=${ENV.WEB_DOMAIN}; path=/; hostOnly=false; secure=true; session=true;`
  document.cookie = cookie

  setAuthHeader(value)
}

export const removePasscode = () => {
  removeCookie(TOKEN_KEY)
  removeAuthHeader()
}


export const setOrgId = (value: string) => {
  const cookie = `${ORG_KEY}=${value}; path=/; domain=${ENV.WEB_DOMAIN}; hostOnly=true; secure=true; session=true;`
  document.cookie = cookie

  setOrgHeader(value)
}

export const removeOrgId = () => {
  removeCookie(ORG_KEY)
  removeOrgHeader()
}
