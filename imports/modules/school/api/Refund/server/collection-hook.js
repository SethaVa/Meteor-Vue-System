import AutoId from '/imports/util/auto-id'
import Refund from '../refund'

Refund.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Refund, {
    length: 4,
  })
})
