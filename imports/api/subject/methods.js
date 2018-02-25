import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import Subject from './subjects'

// Find
export const findSubject = new ValidatedMethod({
  name: 'findSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Subject.find(selector, options).fetch()
    }
  },
})

// Find One
export const findOneSubject = new ValidatedMethod({
  name: 'findOneSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Subject.findOne(selector, options)
    }
  },
})

// Insert
export const insertSubject = new ValidatedMethod({
  name: 'insertSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Subject.insert(doc)
    }
  },
})

// Update
export const updateSubject = new ValidatedMethod({
  name: 'updateSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Subject.update({ _id: doc._id }, { $set: doc })
    }
  },
})

// Remove
export const removeSubject = new ValidatedMethod({
  name: 'removeSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector) {
    if (Meteor.isServer) {
      return Subject.remove(selector)
    }
  },
})
