import moment from 'moment'

export default function wrapCurrentTime(date) {
  let newDate = moment(date)
  let current = moment()

  newDate.hour(current.hour())
  newDate.minute(current.minute())
  newDate.second(current.second())
  newDate.millisecond(current.millisecond())

  return newDate.toDate()
}
