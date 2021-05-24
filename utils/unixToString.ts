import {DateTime} from 'luxon'

const unixToString = (unix: number): string => {
  const date = DateTime.fromSeconds(unix)
  return date.toLocaleString(DateTime.DATE_FULL)
}
export default unixToString
