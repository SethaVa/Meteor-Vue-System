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
import _ from 'lodash'
import moment from 'moment'
import Categories from './categories'

export const findCategories = new ValidatedMethod({
  name: 'findCategories',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return Categories.find(selector, {
        sort: {
          _id: -1
        }
      }).fetch()
    }
  },
})
//find for Options
export const findCategoriesOpts = new ValidatedMethod({
  name: 'findCategoriesOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let Categories = Categories.find(selector).fetch()

      _.forEach(Categories, o => {
        data.push({
          label: o.Categories,
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneCategories = new ValidatedMethod({
  name: 'findOneCategories',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return Categories.findOne({
        _id: id
      })
    }
  },
})

export const insertCategories = new ValidatedMethod({
  name: 'insertCategories',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Categories.insert(doc)
    }
  },
})

export const updateCategories = new ValidatedMethod({
  name: 'updateCategories',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Categories.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeCategories = new ValidatedMethod({
  name: 'removeCategories',
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
      return Categories.remove(_id)
    }
  },
})