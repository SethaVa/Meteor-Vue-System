import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import Students from './students'
import Payment from '../payment/payment'

// Find All Data
export const findStudents = new ValidatedMethod({
  name: 'findStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, option }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Students.find(selector, option).fetch()
    }
  },
})

// find One
export const findOneStudent = new ValidatedMethod({
  name: 'findOneStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run(_id) {
    if (Meteor.isServer) {
      return Students.findOne(_id)
    }
  },
})

// Insert
export const insertStudent = new ValidatedMethod({
  name: 'insertStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Students.schema,
    details: Payment.schema,
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      try {
        return Students.insert(doc)
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})

// Update
export const updateStudent = new ValidatedMethod({
  name: 'updateStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({ doc: Students.schema }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      return Students.update({ _id: doc._id }, { $set: doc })
    }
  },
})

// Delete
export const removeStudent = new ValidatedMethod({
  name: 'removeStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return Students.update({ _id: _id }, { $set: { remove: true } })
      // return Students.remove(selector)
    }
  },
})
