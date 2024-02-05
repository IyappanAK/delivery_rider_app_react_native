import { IMAGE_EXTENSIONS } from '@/core/constants/index'

const validImgFormats = ['image/jpeg', 'image/png', 'image/webp']

export const isValidFormat = (type: string) => validImgFormats.includes(type)

export const isImgExtension = (ext: string) => IMAGE_EXTENSIONS.includes(ext)

export const getImgExtenstion = (url = '') => url?.split('.')?.slice(-1)[0]

export const isLt2M = (size: number) => size / 1024 / 1024 < 2

export const isLt50M = (size: number) => size / 1024 / 1024 < 50

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const getFormData = (file: RcFile) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('file_type', '1')
  formData.append('name', file?.name)
  formData.append('extension', file?.name?.split('.')?.[1])
  formData.append('size', formatBytes(file?.size))

  return formData
}
