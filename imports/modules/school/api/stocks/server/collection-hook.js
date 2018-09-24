import AutoId from '/imports/utils/auto-id'
import Stocks from '../stocks'

Stocks.before.insert(function (userId, doc) {
  doc._id = AutoId.make(Stocks, {
    length: 3,
  })
})