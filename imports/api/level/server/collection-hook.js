import AutoId from '../../../libs/auto-id'
import Level from '../level'

Level.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Level, {
    length: 2
  })
})
