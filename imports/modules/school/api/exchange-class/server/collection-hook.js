import AutoId from '/imports/util/auto-id'
import ExchangClass from '../exchange-class'

ExchangClass.before.insert(function (userId, doc) {
  doc._id = AutoId.make(ExchangClass, {
    length: 4,
  })
})