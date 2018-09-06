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
import Stock from './stocks'

export const findStock = new ValidatedMethod({
  name: 'findStock',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}

      let data = Stock.aggregate([{
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
export const findStockOpts = new ValidatedMethod({
  name: 'findStockOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let Stock = Stock.find(selector).fetch()

      _.forEach(Stock, o => {
        data.push({
          label: o.Stock,
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneStock = new ValidatedMethod({
  name: 'findOneStock',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return Stock.findOne({
        _id: id
      })
    }
  },
})

export const insertStock = new ValidatedMethod({
  name: 'insertStock',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Stock.insert(doc)
    }
  },
})

export const updateStock = new ValidatedMethod({
  name: 'updateStock',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Stock.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeStock = new ValidatedMethod({
  name: 'removeStock',
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
      return Stock.remove(_id)
    }
  },
})