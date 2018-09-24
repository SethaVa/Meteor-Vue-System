import AutoId from '/imports/utils/auto-id'
import ClassDetails from '../classDetails'

ClassDetails.before.insert(function(userId, doc) {
  doc._id = AutoId.make(ClassDetails, {
    length: 10,
  })
})
