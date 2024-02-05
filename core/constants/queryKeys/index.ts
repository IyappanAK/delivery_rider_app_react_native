import { mergeQueryKeys } from '@lukemorales/query-key-factory'
import { homeQueries } from './home'
import { orgQueries } from './org'

export const refKeyOnOrgChng = []

export const queries = mergeQueryKeys(orgQueries,homeQueries)
