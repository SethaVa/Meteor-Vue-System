import AutoId from '../../../lib/auto-id'
import Income from '../income'

Income.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Income, {
    length: 5,
  })
})
