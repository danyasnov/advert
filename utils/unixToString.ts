const unixToString = (unix: number): string => {
  const date = new Date(unix * 1e3)
  return Intl.DateTimeFormat(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}
export default unixToString
