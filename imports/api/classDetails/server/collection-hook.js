import AutoId from '../../../libs/auto-id'
import ClassDetails from '../classDetails'

ClassDetails.before.insert(function(userId, doc) {
  doc._id = AutoId.make(ClassDetails, {
    length: 2,
  })
})
