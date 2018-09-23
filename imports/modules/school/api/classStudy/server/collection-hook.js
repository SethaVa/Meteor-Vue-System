import AutoId from '/imports/util/auto-id'
import ClassStudy from '../classStudy'

ClassStudy.before.insert(function(userId, doc) {
  doc._id = AutoId.make(ClassStudy, {
    length: 10,
  })
})
