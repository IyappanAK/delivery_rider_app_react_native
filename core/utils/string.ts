import { DefaultOptionType } from 'antd/es/select'

export const stringIncludes: any = (input: string, option: DefaultOptionType) =>
  (String(option?.label) ?? '').toLowerCase().includes(input.toLowerCase())
