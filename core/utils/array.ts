export const getErrorList = (err: any) => {
  const error = err.response.data.error
  const errorList = Object.keys(error).map((e) => ({
    name: e,
    errors: error[e],
  }))

  return errorList
}

export const isLastItem = (arr: any[], i: number): boolean =>
  arr.length - 1 === i
