import AutoId from '../../../lib/auto-id'
import Stocks from '../stocks'

Stocks.before.insert(function (userId, doc) {
  doc._id = AutoId.make(Stocks, {
    length: 3,
  })
})