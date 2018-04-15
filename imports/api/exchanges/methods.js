import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import moment from 'moment'

import Exchanges from './exchanges'

// Find
export const findExchanges = new ValidatedMethod({
  name: 'app.findExchanges',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, options) {
    if (!this.isSimulation) {
      Meteor._sleepForMs(200)
      selector = selector || {}
      options = options || { sort: { _id: -1 }, limit: 1 }

      return Exchanges.find(selector, options).fetch()
    }
  },
})

// Find One
export const findOneExchange = new ValidatedMethod({
  name: 'app.findOneExchange',
  mixins: [CallPromiseMixin],
  // validate: Exchanges.schema.validator(),
  validate: null,
  run(selector, options) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(200)
      selector = selector || {}
      options = options || {}

      return Exchanges.findOne(selector, options)
    }
  },
})

// Insert
export const insertExchange = new ValidatedMethod({
  name: 'app.insertExchange',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(200)

      return Exchanges.insert(doc)
    }
  },
})

// Update
export const updateExchange = new ValidatedMethod({
  name: 'app.updateExchange',
  mixins: [CallPromiseMixin],
  // validate: Exchanges.schema.validator(),
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(200)

      return Exchanges.update({ _id: doc._id }, { $set: doc })
    }
  },
})

/**
 * Upsert methods
 */
export const upsertExchange = new ValidatedMethod({
  name: 'app.upsertExchange',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      let _id
      if (doc._id != undefined) {
        _id = doc._id
      }
      return Exchanges.upsert({ _id }, { $set: doc })
    }
  },
})
// Remove
export const removeExchange = new ValidatedMethod({
  name: 'app.removeExchange',
  mixins: [CallPromiseMixin],
  // validate: null,
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run(selector) {
    if (Meteor.isServer) {
      Exchanges.remove(selector)
      return 'success'
    }
  },
})
