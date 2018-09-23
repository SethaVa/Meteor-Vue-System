import AutoId from '/imports/util/auto-id'
import Staff from '../staff'

Staff.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Staff, {
    length: 4,
  })
})
