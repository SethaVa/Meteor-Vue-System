import AutoId from '/imports/utils/auto-id'
import Exchanges from '../exchanges'

Exchanges.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Exchanges, {
    length: 3,
  })
})
