import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import Register from './register'
import Payment from '../payment/payment'
import _ from 'lodash'
import { insertIncome, removeIncomeFromOther } from '../../api/Income/methods'
// Find All Data
export const findRegister = new ValidatedMethod({
  name: 'findRegister',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, option }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Register.find(selector, option).fetch()
    }
  },
})

export const findRegisterForClass = new ValidatedMethod({
  name: 'findRegisterForClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // option = option || {}
      return aggregateRegister(selector)
    }
  },
})

// export const findClassForStudenDetails = new ValidatedMethod({
//   name: 'findClassForStudenDetails',
//   mixins: [CallPromiseMixin],
//   validate: null,
//   run({ selector }) {
//     if (Meteor.isServer) {
//       selector = selector || {}
//       // option = option || {}
//       return aggregateRegister(selector)
//     }
//   },
// })

// find One
export const findOneRegister = new ValidatedMethod({
  name: 'findOneRegister',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ _id }) {
    if (Meteor.isServer) {
      return Register.findOne(_id)
    }
  },
})

// Find Data For Options
export const findRegisterOpts = new ValidatedMethod({
  name: 'findRegisterOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector, option) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}
      let data = []
      let Register = Register.find(selector, option).fetch()
      _.forEach(Register, o => {
        data.push({
          label: o._id + '-' + o.RegisterName,
          value: o._id,
        })
      })
      return data
    }
  },
})

// Insert សំរាបើសិស្សNew
export const insertRegister = new ValidatedMethod({
  name: 'insertRegister',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Register.schema,
    details: Payment.schema,
  }).validator(),
  run({ doc, details }) {
    if (Meteor.isServer) {
      try {
        Register.insert(doc, (error, RegisterId) => {
          if (!error) {
            Payment.insert(details, error => {
              if (!error) {
                let data = {
                  tranDate: doc.tranDate,
                  referenceId: RegisterId,
                  referenceType: 'New',
                  totalUsd: details.usd,
                  totalKhr: details.khr,
                }
                insertIncome.run({ doc: data })
              }
            })
            // let value = 'Closed'
            // updateRegisterStatus.run({ _id, value })
          }
        })
        return 'Success'
      } catch (error) {
        throw new Meteor.Error('Error', 'Register', error.reason)
      }
    }
  },
})
// Update សំរាប់សិស្សNew
export const updateRegisterForRefund = new ValidatedMethod({
  name: 'updateRegister',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Register.schema,
  }).validator(),
  run({ doc }) {
    if (Meteor.isServer) {
      return Register.update(
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
export const updateRegisterStatus = new ValidatedMethod({
  name: 'updateRegisterStatus',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
    value: String,
  }).validator(),
  run({ _id, value }) {
    if (Meteor.isServer) {
      return Register.update(
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
export const removeRegister = new ValidatedMethod({
  name: 'removeRegister',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
    referenceType: String,
  }).validator(),
  run({ _id, referenceType }) {
    if (Meteor.isServer) {
      Register.remove({ _id: _id }, error => {
        if (!error) {
          removeIncomeFromOther.run({
            referenceId: _id,
            referenceType: referenceType,
          })
        }
      })
      return 'Success'
    }
  },
})

const aggregateRegister = selector => {
  let data = Register.aggregate([
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
