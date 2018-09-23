import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import _ from 'lodash'

import rateLimit from '/imports/util/rate-limit'
import AppLog from '/imports/api/app-logs/methods'

import Company from './company'

// Find One
export const findOneCompany = new ValidatedMethod({
  name: 'app.findOneCompany',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      return Company.findOne()
    }
  },
})

// Insert
export const insertCompany = new ValidatedMethod({
  name: 'app.insertCompany',
  mixins: [CallPromiseMixin],
  validate: Company.schema.validator(),
  run(doc) {
    if (Meteor.isServer) {
      return Company.insert(doc)
    }
  },
})

// Update
export const updateCompany = new ValidatedMethod({
  name: 'app.updateCompany',
  mixins: [CallPromiseMixin],
  validate: _.clone(Company.schema)
    .extend({
      _id: String,
    })
    .validator(),
  run(doc) {
    if (Meteor.isServer) {
      let update = Company.update({ _id: doc._id }, { $set: doc })

      // App log
      // AppLog.update({ title: 'Company', data: doc })

      return update
    }
  },
})

rateLimit({
  methods: [findOneCompany, insertCompany, updateCompany],
})
