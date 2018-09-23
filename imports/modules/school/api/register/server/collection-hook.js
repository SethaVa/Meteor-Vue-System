import AutoId from '/imports/util/auto-id'
import Register from '../register'

Register.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Register, {
    length: 8,
  })
})
