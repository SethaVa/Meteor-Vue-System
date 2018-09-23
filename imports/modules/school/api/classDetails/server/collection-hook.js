import AutoId from '/imports/util/auto-id'
import ClassDetails from '../classDetails'

ClassDetails.before.insert(function(userId, doc) {
  doc._id = AutoId.make(ClassDetails, {
    length: 10,
  })
})
