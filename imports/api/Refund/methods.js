import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import Refund from './refund'
import {
  updatePaymentForRefund,
  removePaymentFromRefund,
} from '../payment/methods'
import {
  removeIncomeFromOther,
  insertIncome,
  updateIncomeForPaymentNew,
} from '../Income/methods'
export const findRefund = new ValidatedMethod({
  name: 'findRefund',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return Refund.find(selector).fetch()
    }
  },
})

export const findOneRefund = new ValidatedMethod({
  name: 'findOneRefund',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      return Refund.findOne({ _id: id })
    }
  },
})

export const insertRefund = new ValidatedMethod({
  name: 'insertRefund',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: _.clone(Refund.schema).extend({ remaining: Number, status: String }),
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      let remaining = doc.remaining
      let status = doc.status
      Refund.insert(doc, (error, refundId) => {
        if (!error) {
          // Payment
          let Payment = {
            _id: doc.payId,
            usd: doc.usd,
            khr: doc.khr,
            remaining: remaining,
            status: status,
          }
          updatePaymentForRefund.run({ doc: Payment })

          // Income
          let data = {
            tranDate: doc.tranDate,
            referenceId: refundId,
            referenceType: 'Refund',
            totalUsd: doc.usd,
            totalKhr: doc.khr,
          }
          insertIncome.run({ doc: data })
        }
      })
      return 'Success'
    }
  },
})

export const updateRefund = new ValidatedMethod({
  name: 'updateRefund',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: _.clone(Refund.schema).extend({ status: String, remaining: Number }),
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      Refund.update({ _id: doc._id }, { $set: doc }, error => {
        if (!error) {
          let Payment = {
            _id: doc.payId,
            usd: doc.usd,
            khr: doc.khr,
            remaining: doc.remaining,
            tranDate: doc.tranDate,
          }
          updatePaymentForRefund.run({ doc: Payment })

          // Income
          let data = {
            tranDate: doc.tranDate,
            referenceId: doc._id,
            referenceType: 'Refund',
            totalUsd: doc.usd,
            totalKhr: doc.khr,
          }
          updateIncomeForPaymentNew.run({ doc: data })
        }
      })
      return 'Success'
    }
  },
})

export const removeRefund = new ValidatedMethod({
  name: 'removeRefund',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      Refund.remove(_id)
      removePaymentFromRefund.run({ _id })
      removeIncomeFromOther.run({ referenceId: _id, referenceType: 'Refund' })
    }
  },
})
