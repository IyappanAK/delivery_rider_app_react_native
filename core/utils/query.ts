export const getNextPageParam = (lastPage: any) => {
  if (lastPage?.count - lastPage?.current_page * lastPage?.page_size > 0) {
    return lastPage?.current_page + 1
  }
  return false
}
