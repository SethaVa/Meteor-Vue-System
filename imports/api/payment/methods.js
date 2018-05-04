import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import Payment from './payment'
import _ from 'lodash'

import {
  insertIncome,
  removeIncomeFromOther,
  updateIncomeForPaymentNew,
} from '../Income/methods'

// Find All Data
export const findPayment = new ValidatedMethod({
  name: 'findPayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, option }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Payment.find(selector, option).fetch()
    }
  },
})

export const findPaymentForClass = new ValidatedMethod({
  name: 'findPaymentForClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // option = option || {}
      return aggregatePayment(selector)
    }
  },
})

export const findClassForStudenDetails = new ValidatedMethod({
  name: 'findClassForStudenDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // option = option || {}
      return aggregatePayment(selector)
    }
  },
})

// find One
export const findOnePayment = new ValidatedMethod({
  name: 'findOnePayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ _id }) {
    if (Meteor.isServer) {
      return Payment.findOne(_id)
    }
  },
})

// Find Data For Options
export const findPaymentOpts = new ValidatedMethod({
  name: 'findPaymentOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, option) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}
      let data = []
      let Payment = Payment.find(selector, option).fetch()
      _.forEach(Payment, o => {
        data.push({
          label: o._id + '-' + o.PaymentName,
          value: o._id,
        })
      })
      return data
    }
  },
})
// For New Student
export const insertPayementForNew = new ValidatedMethod({
  name: 'insertPaymentForNew',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({ doc: Payment.schema }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      Payment.insert(doc, (error, paymentId) => {
        if (!error) {
          let data = {
            tranDate: doc.tranDate,
            referenceId: paymentId,
            referenceType: 'New',
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
// update for new Student
export const updatePayementForNew = new ValidatedMethod({
  name: 'updatePayementForNew',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ doc }) {
    if (Meteor.isServer) {
      let _id = doc._id
      Payment.update({ _id: _id }, { $set: doc }, error => {
        if (!error) {
          let data = {
            tranDate: doc.tranDate,
            referenceId: _id,
            referenceType: 'New',
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

// Insert សំរាបើសិស្សចាស់ដែលគាតមកបងលុយ
export const insertPayment = new ValidatedMethod({
  name: 'insertPayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema,
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      try {
        Payment.insert(doc, (error, paymentId) => {
          if (!error) {
            // Update Status Expire Payement
            let value = 'Closed'
            updatePaymentStatus.run({ _id: doc.lastId, value })

            let data = {
              tranDate: doc.tranDate,
              referenceId: paymentId,
              referenceType: 'Payment',
              totalUsd: doc.usd,
              totalKhr: doc.khr,
            }
            updateIncomeForPaymentNew.run({ doc: data })
          }
        })

        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})

// update សំរាបើសិស្សចាស់ដែលគាតមកបងលុយ
export const updatePaymentForPayment = new ValidatedMethod({
  name: 'updatePaymentForPayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema,
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      try {
        Payment.update({ _id: doc._id }, { $set: doc }, error => {
          if (!error) {
            // Update Status Expire Payement
            // let value = 'Closed'
            // updatePaymentStatus.run({ _id, value })
            let data = {
              tranDate: doc.tranDate,
              referenceId: doc._id,
              referenceType: 'Payment',
              totalUsd: doc.usd,
              totalKhr: doc.khr,
            }
            updateIncomeForPaymentNew.run({ doc: data })
          }
        })

        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Payment', error.reason)
      }
    }
  },
})

// Update សំរាប់សិស្សដែលគាតជំពាក់លុយ រួចហើយគាតមកសងលុយវិញ
export const updatePaymentForRefund = new ValidatedMethod({
  name: 'updatePayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ doc }) {
    if (Meteor.isServer) {
      console.log(doc)
      Payment.update(
        {
          _id: doc._id,
        },
        {
          $set: {
            status: doc.status,
            remaining: doc.remaining,
          },
          $inc: {
            usd: doc.usd,
            khr: doc.khr,
          },
        }
      )

      return 'Success'
    }
  },
})
// Update Status
export const updatePaymentStatus = new ValidatedMethod({
  name: 'updatePaymentStatus',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
    value: String,
  }).validator(),
  run({ _id, value }) {
    if (Meteor.isServer) {
      return Payment.update(
        {
          _id: _id,
        },
        {
          $set: { status: value },
        }
      )
    }
  },
})

// Delete
export const removePayment = new ValidatedMethod({
  name: 'removePayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  run({ selector }) {
    if (Meteor.isServer) {
      Payment.update({ _id: selector.lastId }, { $set: { status: 'Expires' } })

      Payment.remove({ _id: selector._id }, error => {
        if (!error) {
          removeIncomeFromOther.run({
            referenceId: selector._id,
            referenceType: selector.referenceType,
          })
        }
      })
      return 'Success'
    }
  },
})
// Remove Payment from Refund
export const removePaymentFromRefund = new ValidatedMethod({
  name: 'removePaymentFromRefund',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String,
    },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      Payment.remove({ _id: _id })

      return 'Success'
    }
  },
})
const aggregatePayment = selector => {
  let data = Payment.aggregate([
    {
      $match: selector,
    },
    {
      $lookup: {
        from: 'classStudy',
        localField: 'classId',
        foreignField: '_id',
        as: 'classDoc',
      },
    },
    {
      $unwind: {
        path: '$classDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'rooms',
        localField: 'classDoc.roomId',
        foreignField: '_id',
        as: 'roomDoc',
      },
    },
    {
      $unwind: {
        path: '$roomDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'timeStudy',
        localField: 'classDoc.timeId',
        foreignField: '_id',
        as: 'timeDoc',
      },
    },
    {
      $unwind: {
        path: '$timeDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'subjects',
        localField: 'classDoc.subId',
        foreignField: '_id',
        as: 'subjectDoc',
      },
    },
    {
      $unwind: {
        path: '$subjectDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'staff',
        localField: 'classDoc.staffId',
        foreignField: '_id',
        as: 'staffDoc',
      },
    },
    {
      $unwind: {
        path: '$staffDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'studentDoc',
      },
    },
    {
      $unwind: {
        path: '$studentDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$classId',
        staffId: { $last: '$staffDoc._id' },
        teacher: { $last: '$staffDoc.name' },
        room: { $last: '$roomDoc.roomName' },
        subject: { $last: '$subjectDoc.title' },
        time: { $last: '$timeDoc.timeStudy' },
        classDetail: {
          $push: {
            _id: '$_id',
            classId: '$classId',
            studentId: '$studentDoc._id',
            student: '$studentDoc.enName',
            gender: '$studentDoc.gender',
            payDate: '$payDate',
            duration: '$duration',
            usd: '$usd',
            khr: '$khr',
            discountVal: '$discountVal',
            remaining: '$remaining',
            endPayDate: '$endPayDate',
            type: '$type',
            status: '$status',
          },
        },
      },
    },
    {
      $project: {
        staffId: 1,
        teacher: 1,
        room: 1,
        subject: 1,
        time: 1,
        classDetail: 1,
      },
    },
  ])
  return data
}
