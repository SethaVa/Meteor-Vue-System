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
import Items from './items'

export const findItems = new ValidatedMethod({
  name: 'sch.findItems',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}

      let data = Items.aggregate([{
          $match: selector
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'categoryDoc'
          }
        },
        {
          $unwind: {
            path: '$categoryDoc',
            preserveNullAndEmptyArrays: true
          }
        }
      ])

      return data
    }
  },
})
//find for Options
export const findItemsOpts = new ValidatedMethod({
  name: 'sch.findItemsOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let Items = Items.find(selector).fetch()

      _.forEach(Items, o => {
        data.push({
          label: o.Items,
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneItems = new ValidatedMethod({
  name: 'sch.findOneItems',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return Items.findOne({
        _id: id
      })
    }
  },
})

export const insertItems = new ValidatedMethod({
  name: 'sch.insertItems',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Items.insert(doc)
    }
  },
})

export const updateItems = new ValidatedMethod({
  name: 'sch.updateItems',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Items.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeItems = new ValidatedMethod({
  name: 'sch.removeItems',
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
      return Items.remove(_id)
    }
  },
})