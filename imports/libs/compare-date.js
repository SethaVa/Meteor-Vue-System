import _ from 'lodash'
import moment from 'moment'
import Payment from '../api/payment/payment'
import {
  findPayment,
  updatePaymentStatus
} from '../api/payment/methods'

const compareDate = function () {
  // const currentDate = moment(moment().toDate()).format('L')
  // const currentDate = wrapCurrentTime(moment(moment().toDate()).add(3, 'day'));
  let currentDate = moment(moment().toDate()).add(3, 'day')
  let current = moment()

  currentDate.hour(current.hour())
  currentDate.minute(current.minute())
  currentDate.second(current.second())
  currentDate.millisecond(current.millisecond())
  currentDate = currentDate.toDate()

  let selector = {
    status: 'Paid',
    endPayDate: {
      $lte: moment(currentDate)
        .endOf('day')
        .toDate(),
    },
  }
  findPayment
    .callPromise({
      selector: selector
    })
    .then(result => {
      _.forEach(result, obj => {

        let value = 'Expires'
        updatePaymentStatus
          .callPromise({
            _id: obj._id,
            value
          })
          .then(result => {})
          .catch(error => {})
      })
    })
    .catch(error => {
      console.log(error.reason)
    })

  return 'updateSuccess'
}

export default compareDate