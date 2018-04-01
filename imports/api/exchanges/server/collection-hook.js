import AutoId from '../../../libs/auto-id'
import Exchanges from '../exchanges'

Exchanges.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Exchanges, {
    length: 3,
  })
  console.log(doc._id)
})
