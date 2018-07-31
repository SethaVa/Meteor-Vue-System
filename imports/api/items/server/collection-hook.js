import AutoId from '../../../libs/auto-id'
import Items from '../items'

Items.before.insert(function (userId, doc) {
  doc._id = AutoId.make(Items, {
    length: 3,
  })
})