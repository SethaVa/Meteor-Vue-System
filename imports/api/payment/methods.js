import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import Payment from './payment'
import Student from '../students/students'
import _ from 'lodash'
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

// Insert សំរាបើសិស្សចាស់ដែលគាតមកបងលុយ
export const insertPayment = new ValidatedMethod({
  name: 'insertPayment',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Payment.schema,
    _id: {
      type: String,
      optional: true,
    },
  }).validator(),
  run({ doc, _id }) {
    if (Meteor.isServer) {
      try {
        return Payment.insert(doc, (error, result) => {
          if (!error) {
            let value = 'Closed'
            updatePaymentStatus.run({ _id, value })
          }
        })
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
  validate: new SimpleSchema({
    doc: Payment.schema,
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      return Payment.update(
        {
          _id: doc._id,
        },
        {
          $set: doc,
        }
      )
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
      console.log(_id, value)
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
    _id: {
      type: String,
    },
  }).validator(),
  run(selector) {
    if (Meteor.isServer) {
      return Payment.remove(selector)
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
            totalPay: '$totalPay',
            discountVal: '$discountVal',
            pay: '$pay',
            remaining: '$remaining',
            endPayDate: '$endPayDate',
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
