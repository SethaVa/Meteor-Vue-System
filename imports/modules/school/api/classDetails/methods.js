import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import classDetails from './classDetails'
//Find
export const findclassDetails = new ValidatedMethod({
  name: 'sch.findclassDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return classDetails.find(selector).fetch()
    }
  },
})
// Find One
export const findOneclassDetails = new ValidatedMethod({
  name: 'sch.findOneclassDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      return classDetails.findOne({ _id: id })
    }
  },
})

export const insertClassDetail = new ValidatedMethod({
  name: 'sch.insertClassDetail',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return classDetails.insert(doc)
    }
  },
})

// Update
export const updateclassDetails = new ValidatedMethod({
  name: 'sch.updateclassDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return classDetails.update({ _id: doc._id }, { $set: doc })
    }
  },
})

export const removeclassDetails = new ValidatedMethod({
  name: 'sch.removeclassDetails',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return classDetails.remove(_id)
    }
  },
})
