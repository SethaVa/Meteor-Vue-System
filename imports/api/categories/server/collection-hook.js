import AutoId from '../../../libs/auto-id'
import Categories from '../categories'

Categories.before.insert(function (userId, doc) {
  doc._id = AutoId.make(Categories, {
    length: 2,
  })
})