import _ from 'lodash'
import moment from 'moment'
import Payment from '../api/payment/payment'
import { findPayment, updatePaymentStatus } from '../api/payment/methods'

const compareDate = function() {
  const currentDate = moment(moment().toDate()).format('L')
  let selector = {
    status: 'Paid',
  }
  findPayment
    .callPromise({ selector: selector })
    .then(result => {
      _.forEach(result, obj => {
        let compareDate = moment(currentDate).isSame(
          moment(obj.endPayDate).format('L')
        )

        if (compareDate) {
          let value = 'Expires'
          updatePaymentStatus
            .callPromise({ _id: obj._id, value })
            .then(result => {})
            .catch(error => {})
        }
      })
    })
    .catch(error => {
      console.log(error.reason)
    })

  return 'updateSuccess'
}

export default compareDate
