import AutoId from '/imports/utils/auto-id'
import Payment from '../payment'

Payment.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Payment, {
    length: 8,
  })
})
