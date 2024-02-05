import { useMutation, useQuery } from '@tanstack/react-query'
import { UseMutationType, UseQueryType } from '@contracts/query'
import * as API from './api'
import { IOrg, ITempOrg, IUploadRes, IUserInfo } from '@contracts/models/org'
import { queries } from '@constants/queryKeys'

export const useCreateTempOrg: UseMutationType<ITempOrg, Partial<ITempOrg>> = (
  options
) => useMutation(API.postTempOrg, options)

export const useTempOrgInfo: UseQueryType<ITempOrg> = (options) =>
  useQuery({
    queryKey: queries.org.temp_info.queryKey,
    queryFn: API.getTempOrg,
    ...options,
  })

export const useOrgUserInfo: UseQueryType<IUserInfo> = (options) =>
  useQuery({
    queryKey: queries.org.user_info.queryKey,
    queryFn: API.getOrgUserInfo,
    ...options,
  })

export const useUpdateTempOrg: UseMutationType<
  ITempOrg,
  Partial<ITempOrg> & { id: number }
> = (options) => useMutation(API.putTempOrg, options)

export const useCreateOrg: UseMutationType<IOrg, { tempId: number }> = (
  options
) => useMutation(API.postCreateOrg, options)

export const useUpload: UseMutationType<IUploadRes, FormData> = (options) =>
  useMutation(API.postUpload, options)

export const useOrgInfo: UseQueryType<IOrg> = (options) =>
  useQuery({
    queryKey: queries.org.org_info.queryKey,
    queryFn: API.getOrgInfo,
    ...options,
  })
