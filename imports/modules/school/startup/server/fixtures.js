import {
  Meteor
} from 'meteor/meteor'
// import { Roles } from 'meteor/alanning:roles'
// import { Accounts } from 'meteor/accounts-base'

import Level from '/imports/modules/school/api/level/level'
import {
  insertLevel
} from '/imports/modules/school/api/level/methods'

Meteor.startup(function () {
  // User
  if (Level.find().count() === 0) {
    for (let i = 1; i <= 12; i++) {
      insertLevel.run({
        doc: {
          level: i
        }
      })
    }
  }
})