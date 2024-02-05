import { BOM_PRINT_TYPE_CODE, RAW_MATERIAL_FORM_CODE } from '@constants/dynamic'

export const reorderBOM = (list: any[] = [], printing_type: number) => {
  const reList = [...list]

  const inkIndex = list?.findIndex(
    (f) => f?.data?.code === RAW_MATERIAL_FORM_CODE['ink']
  )
  const ink = list?.find((f) => f?.data?.code === RAW_MATERIAL_FORM_CODE['ink'])

  if (inkIndex !== -1) {
    reList.splice(inkIndex, 1)

    if (printing_type === BOM_PRINT_TYPE_CODE['surface']) {
      reList.unshift(ink)
    }

    if (printing_type === BOM_PRINT_TYPE_CODE['reverse']) {
      reList.splice(1, 0, ink)
    }
  }

  return reList
}
