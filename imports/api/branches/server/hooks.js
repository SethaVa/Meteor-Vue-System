import AutoId from '/imports/util/auto-id'

// Collection
import Branches from '../branches'

Branches.before.insert(function(userId, doc) {
  doc._id = AutoId.make(Branches, { length: 3 })
})
