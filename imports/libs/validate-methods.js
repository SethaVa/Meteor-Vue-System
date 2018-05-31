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

import rateLimit from './rate-limit'
import {
  userIsInRole,
  throwError
} from './security'

// Use exist
export const validateUserExist = new ValidatedMethod({
  name: 'validateUserExist',
  mixins: [CallPromiseMixin],
  validate(selector) {
    check(selector, Object)
  },
  run(selector) {
    if (Meteor.isServer) {
      try {
        return Meteor.users.findOne(selector)
      } catch (e) {
        throwError(e)
        //console.log(e.reason)
      }
    }
  },
})

// User password
export const validateUserPassword = new ValidatedMethod({
  name: 'validateUserPassword',
  mixins: [CallPromiseMixin],
  validate(password) {
    check(password, String)
  },
  run(password) {
    if (Meteor.isServer) {
      let digest = Package.sha.SHA256(password)
      let user = Meteor.user()
      let passwordOpts = {
        digest: digest,
        algorithm: 'sha-256'
      }
      let result = Accounts._checkPassword(user, passwordOpts)

      return result
    }
  },
})