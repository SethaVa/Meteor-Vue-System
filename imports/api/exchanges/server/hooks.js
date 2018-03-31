import AutoId from '../../../libs/auto-id'

// Collection
import Exchanges from '../exchanges'

Exchanges.before.insert(function (userId, doc) {
  doc._id = AutoId.make(Exchanges, {
    length: 2,
  })
})