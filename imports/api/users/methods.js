import {
  Meteor
} from 'meteor/meteor'
import {
  Accounts
} from 'meteor/accounts-base'
import {
  check
} from 'meteor/check'
import {
  Roles
} from 'meteor/alanning:roles'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import { userIsInRole, throwError } from '/imports/util/security'
import rateLimit from '/imports/util/rate-limit'

import {
  UserInsertSchema,
  UserUpdateSchema
} from './users'

// Find
export const findUsers = new ValidatedMethod({
  name: 'app.findUsers',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(100)
      return Meteor.users.find(selector, options).fetch()
    }
  },
})

// Find One
export const findOneUser = new ValidatedMethod({
  name: 'app.findOneUser',
  mixins: [CallPromiseMixin],
  validate:new SimpleSchema({
    _id:String
  }).validator(),
  run({_id}) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(100)
      return Meteor.users.findOne(_id)
    }
  },
})

// Insert
export const insertUser = new ValidatedMethod({
  name: 'app.insertUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    user: UserInsertSchema,
  }).validator(),
  run({
    user
  }) {
    if (Meteor.isServer) {
      try {
      // Check role
      userIsInRole(['super', 'admin'])

        // Add new user
        const userId = Accounts.createUser({
          username: user.username,
          email: user.email,
          password: user.password,
          profile: {
            fullName: user.fullName,
            allowedBranches: user.allowedBranches,
            status: user.status,
          },
        })
        // Add roles
        Roles.addUsersToRoles(userId, user.roles)

        return userId
      } catch (e) {
        // console.log(e.reason)
        throwError(e)
      }
    }
  },
})

// Update
export const updateUser = new ValidatedMethod({
  name: 'app.updateUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    user: UserUpdateSchema,
  }).validator(),
  run({
    user
  }) {
    if (Meteor.isServer) {
      // Check role
      try {
      userIsInRole(['super', 'admin'])

        // Update user
        Meteor.users.update({
          _id: user._id
        }, {
          $set: {
            username: user.username,
            'emails.0.address': user.email,
            profile: {
              fullName: user.fullName,
              allowedBranches: user.allowedBranches,
              status: user.status,
            },
          },
        })
        // Update roles
        Roles.setUserRoles(user._id, user.roles)

        // Update password
        Accounts.setPassword(user._id, user.password, {
          logout: false
        })
        if (user._id === Meteor.userId()) {
          return 'logout'
        }

        return 'success'
      } catch (e) {
        // console.log(e.reason);
        throwError(e)
      }
    }
  },
})

export const removeUser = new ValidatedMethod({
  name: 'app.removeUser',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String
    },
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      // Check role
      userIsInRole(['super'])

      try {
        return Meteor.users.remove(_id)
      } catch (e) {
        throwError(e)
        // console.log(e.reason)
      }
    }
  },
})

rateLimit({
  methods: [findUsers, findOneUser, insertUser, updateUser, removeUser],
})