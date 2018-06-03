import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import {
  RestMethodMixin
} from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import Room from './room'
import _ from 'lodash'
// Find All Data
export const findRoom = new ValidatedMethod({
  name: 'findRoom',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, option) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Room.find(selector, option).fetch()
    }
  },
})



// find One
export const findOneRoom = new ValidatedMethod({
  name: 'findOneRoom',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    _id
  }) {
    if (Meteor.isServer) {
      return Room.findOne(_id)
    }
  },
})

// Find Data Fro Options
export const findRoomOpts = new ValidatedMethod({
  name: 'findRoomOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, option) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}
      let data = []
      let room = Room.find(selector, option).fetch()
      _.forEach(room, o => {
        data.push({
          label: o._id + '-' + o.roomName,
          value: o._id,
        })
      })
      return data
    }
  },
})

// Insert
export const insertRoom = new ValidatedMethod({
  name: 'insertRoom',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Room.insert(doc)
    }
  },
})
// Update
export const updateRoom = new ValidatedMethod({
  name: 'updateRoom',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Room.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

// Delete
export const removeRoom = new ValidatedMethod({
  name: 'removeRoom',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String
    },
  }).validator(),
  run(selector) {
    if (Meteor.isServer) {
      return Room.remove(selector)
    }
  },
})