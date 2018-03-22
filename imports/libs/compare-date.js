import _ from 'lodash'
import moment from 'moment'
import Payments from '../api/payment/payment'

const compareDate = ({ date }) => {
  const currentDate = moment(date).format('L')
  let payments = Payments.find().fetch()
  console.log(payments)
  _.forEach(payments, obj => {
    let compareDate = moment(currentDate).isSame(
      moment(obj.endPayDate).format('L')
    )
    if (compareDate) {
      Payment.update(
        {
          _id: obj._id,
        },
        {
          $set: { status: 'Expire' },
        }
      )
    }
  })
  return 'success'
}

export default compareDate
