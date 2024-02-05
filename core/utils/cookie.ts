import { ENV } from '@/config/app.config'

export const getCookieObject = () =>
  document.cookie
    .split('; ')
    .reduce((prev: Record<string, string>, current) => {
      const [name, ...value] = current.split('=')
      prev[name] = value.join('=')
      return prev
    }, {})

export const getCookie = (name: string) => getCookieObject()[name]

export const removeCookie = (name: string) => {
  document.cookie =
    name +
    `=; domain=${ENV.WEB_DOMAIN}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}
