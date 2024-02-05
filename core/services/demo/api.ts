import { ENV } from '@/config/app.config'
import { GET, POST, PUT } from '@/core/lib/AxiosClient'

export const postTempOrg = (data: any)=>
  POST({
    url: ENV.BASE_URL + 'core/temp-organization/',
    data,
  })

export const putTempOrg = (
  data:any
)=>
  PUT({
    url: ENV.BASE_URL + `core/temp-organization/${data.id}/`,
    data,
  })

export const getEmployees=()=>
  GET({
    url: ENV.BASE_URL + 'employees',
  })

export const getOrgUserInfo = ()=>
  GET({ url: ENV.BASE_URL + 'core/user-info/' })

export const postCreateOrg = (data: { tempId: number }) =>
  POST({
    url: ENV.BASE_URL + `core/organization/${data.tempId}/`,
  })

export const postUpload = (data: FormData) =>
  POST({
    url: 'organization/file-upload/',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data,
  })

export const getOrgInfo = () =>
  GET({
    url: ENV.BASE_URL + 'core/organization-info/',
  })
