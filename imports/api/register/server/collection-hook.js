import AutoId from '../../../libs/auto-id'
import Register from '../register'

Register.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Register, {
    length: 8,
  })
})
