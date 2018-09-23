import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import { Roles } from 'meteor/alanning:roles'

import _ from 'lodash'
import moment from 'moment'

import Branches from '../api/branches/branches'

import {
  SimpleSchema
} from 'simpl-schema/dist/SimpleSchema';

// Roles
export const lookupRole = new ValidatedMethod({
  name: 'app.lookupRole',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      Meteor._sleepForMs(100)

      // Check roles
      let notEqualSelector = ['super']
      if (!Roles.userIsInRole(Meteor.userId(), 'super')) {
        notEqualSelector.push('admin')
      }

      let list = []
      let data = Meteor.roles.find(
        { name: { $nin: notEqualSelector } },
        { sort: { name: 1 } }
      )
      data.forEach(o => {
        list.push({ label: o.name, value: o.name })
      })

      return list
    }
  },
})

// Branch
export const lookupBranch = new ValidatedMethod({
  name: 'app.lookupBranch',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      optional: true,
      blackbox: true
    }
  }).validator(),
  run({selector}) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(100)
      selector = selector || {}

      let list = []
      let data = Branches.find(selector, {
        sort: {
          _id: 1
        }
      }).fetch()
      data.forEach(o => {
        list.push({
          label: o.name,
          value: o._id
        })
      })

      return list
    }
  },
})