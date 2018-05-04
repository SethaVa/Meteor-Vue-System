import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import moment from 'moment'
import Income from './income'
import IncomeDetails from './incomeDetails'
import incomeDetails from './incomeDetails'

export const findIncome = new ValidatedMethod({
  name: 'findIncome',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return Income.find(selector, options).fetch()
    }
  },
})

// Insert and Update Schema Validate
const inUpSchema = new SimpleSchema({
  doc: Income.schema,
  details: {
    type: Array,
    optional: true,
  },
  'details.$': Object,
  'details.$.name': {
    type: String,
  },
  'details.$.qty': {
    type: Number,
  },
  'details.$.usd': {
    type: Number,
    optional: true,
  },
  'details.$.khr': {
    type: Number,
    optional: true,
  },
})

export const findOneIncome = new ValidatedMethod({
  name: 'findOneIncome',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      let data = Income.findOne({ _id: id })
      let details = IncomeDetails.find({
        referenceId: id,
        referenceType: data.referenceType,
      }).fetch()
      return { data, details }
    }
  },
})
//insert
export const insertIncome = new ValidatedMethod({
  name: 'insertIncome',
  mixins: [CallPromiseMixin],
  validate: inUpSchema.validator(),
  run({ doc, details }) {
    if (Meteor.isServer) {
      try {
        if (doc.referenceType === 'Expend') {
          doc.totalUsd = -doc.totalUsd
          doc.totalKhr = -doc.totalKhr
        } else {
          doc.totalUsd = doc.totalUsd
          doc.totalKhr = doc.totalKhr
        }
        Income.insert(doc, (error, IncomeId) => {
          if (!error) {
            _.forEach(details, obj => {
              if (doc.referenceType === 'Expend') {
                obj.usd = -obj.usd
                obj.khr = -obj.khr
              } else {
                obj.usd = obj.usd
                obj.khr = obj.khr
              }
              obj.tranDate = doc.tranDate
              obj.referenceType = doc.referenceType
              obj.referenceId = IncomeId

              incomeDetails.insert(obj)
            })
          }
        })

        return 'success'
      } catch (error) {
        throw new Meteor.Error(error.reason)
      }
    }
  },
})

export const updateIncome = new ValidatedMethod({
  name: 'updateIncome',
  mixins: [CallPromiseMixin],
  validate: inUpSchema.validator(),
  run({ doc, details }) {
    if (Meteor.isServer) {
      Income.update({ _id: doc._id }, { $set: doc }, (error, result) => {
        if (!error) {
          IncomeDetails.remove({ referenceId: doc._id })
          let items = []
          _.forEach(details, obj => {
            if (doc.referenceType === 'Expend') {
              obj.usd = -obj.usd
              obj.khr = -obj.khr
            } else {
              obj.usd = obj.usd
              obj.khr = obj.khr
            }
            obj.tranDate = doc.tranDate
            obj.referenceType = doc.referenceType
            obj.referenceId = doc._id

            items.push(obj)
          })
          incomeDetails.rawCollection().insert(items)
        }
      })
      return 'success'
    }
  },
})

export const updateIncomeForPaymentNew = new ValidatedMethod({
  name: 'updateIncomeForPaymentNew',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ doc }) {
    if (Meteor.isServer) {
      console.log(doc)
      Income.remove({ referenceId: doc.referenceId })

      Income.insert(doc)

      return 'success'
    }
  },
})

export const removeIncome = new ValidatedMethod({
  name: 'removeIncome',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      Income.remove(_id)
      IncomeDetails.remove({ referenceId: _id })

      return 'success'
    }
  },
})
export const removeIncomeFromOther = new ValidatedMethod({
  name: 'removeIncomeFromOther',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    referenceId: { type: String },
    referenceType: {
      type: String,
    },
  }).validator(),
  run({ referenceId, referenceType }) {
    if (Meteor.isServer) {
      console.log(referenceId, referenceType)
      Income.remove({ referenceId: referenceId, referenceType: referenceType })

      return 'success'
    }
  },
})
