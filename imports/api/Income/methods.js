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
import Income from './income'
import IncomeDetails from './incomeDetails'
import incomeDetails from './incomeDetails'


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

export const findIncome = new ValidatedMethod({
  name: 'findIncome',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return Income.find(selector, options).fetch()
    }
  },
})

// Reprot Income and Expent
export const findIncomeExpend = new ValidatedMethod({
  name: 'findIncomeExpend',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return aggregateInEx(selector)
    }
  },
})


// find for Daily Report from Register Payment Refund
export const findDailyReport = new ValidatedMethod({
  name: 'findDailyReport',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return aggregateDailyReport(selector)
    }
  },
})

// find for Daily Report from Register Payment Refund
export const findMonthlyReport = new ValidatedMethod({
  name: 'findMonthlyReport',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      return aggregateMonthyInEx(selector)
    }
  },
})



export const findOneIncome = new ValidatedMethod({
  name: 'findOneIncome',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      let data = Income.findOne({
        _id: id
      })
      let details = IncomeDetails.find({
        referenceId: id,
        referenceType: data.referenceType,
      }).fetch()
      return {
        data,
        details
      }
    }
  },
})
//insert
export const insertIncome = new ValidatedMethod({
  name: 'insertIncome',
  mixins: [CallPromiseMixin],
  validate: inUpSchema.validator(),
  run({
    doc,
    details
  }) {
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
  run({
    doc,
    details
  }) {
    if (Meteor.isServer) {
      Income.update({
        _id: doc._id
      }, {
        $set: doc
      }, (error, result) => {
        if (!error) {
          IncomeDetails.remove({
            referenceId: doc._id
          })

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

            incomeDetails.insert(obj)
          })
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
  run({
    doc
  }) {
    if (Meteor.isServer) {
      Income.remove({
        referenceId: doc.referenceId
      })

      Income.insert(doc)

      return 'success'
    }
  },
})

export const removeIncome = new ValidatedMethod({
  name: 'removeIncome',
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
      Income.remove(_id)
      IncomeDetails.remove({
        referenceId: _id
      })

      return 'success'
    }
  },
})

export const removeIncomeFromOther = new ValidatedMethod({
  name: 'removeIncomeFromOther',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    referenceId: {
      type: String
    },
    referenceType: {
      type: String,
    },
  }).validator(),
  run({
    referenceId,
    referenceType
  }) {
    if (Meteor.isServer) {
      Income.remove({
        referenceId: referenceId,
        referenceType: referenceType
      })
      return 'success'
    }
  },
})


const aggregateDailyReport = (selector) => {
  selector = selector || {}
  let data = Income.aggregate([

    {
      $lookup: {
        from: "payment",
        localField: "referenceId",
        foreignField: "_id",
        as: "paymentDoc"
      }
    },
    {
      $unwind: {
        path: '$paymentDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "classStudy",
        localField: "paymentDoc.classId",
        foreignField: "_id",
        as: "classDoc"
      }
    },
    {
      $unwind: {
        path: '$classDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "students",
        localField: "paymentDoc.studentId",
        foreignField: "_id",
        as: "studentDoc"
      }
    },
    {
      $unwind: {
        path: '$studentDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: {
          _id: '$_id',
          tranDate: '$tranDate'
        },
        tranDate: {
          $last: '$tranDate'
        },
        referenceType: {
          $last: "$referenceType"
        },
        totalUsd: {
          $last: "$totalUsd"
        },
        totalKhr: {
          $last: "$totalKhr"
        },
        payDate: {
          $last: "$paymentDoc.payDate"
        },
        endPayDate: {
          $last: "$paymentDoc.endPayDate"
        },
        status: {
          $last: "$paymentDoc.status"
        },
        type: {
          $last: '$studentDoc.type'
        },
        enName: {
          $last: "$studentDoc.enName"
        },
        gender: {
          $last: "$studentDoc.gender"
        },
        code: {
          $last: "$paymentDoc._id"
        }
      }
    },
    {
      $match: selector
    },

    {
      $project: {
        _id: 1,
        tranDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$tranDate"
          }
        },
        referenceType: 1,
        totalUsd: 1,
        totalKhr: 1,
        payDate: 1,
        endPayDate: 1,
        status: 1,
        type: 1,
        enName: 1,
        gender: 1,
        code: 1
      }
    },

  ])
  return data
}

// find Income and Expend
const aggregateInEx = selector => {
  selector = selector || {}
  let data = IncomeDetails.aggregate([{
      $match: selector
    },
    {
      $project: {
        _id: 1,
        tranDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$tranDate"
          }
        },
        name: 1,
        usd: 1,
        khr: 1,
        referenceType: 1,
        referenceId: 1
      }
    },
  ])

  return data
}

// find Monthly Report
const aggregateMonthyInEx = selector => {
  selector = selector || {}
  let data = Income.aggregate([{
      $match: selector
    },
    {
      $project: {
        _id: 1,
        tranDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$tranDate"
          }
        },
        referenceType: 1,
        totalUsd: 1,
        totalKhr: 1,

      }
    },
    {
      $group: {
        _id: '$tranDate',
        tranDate: {
          $last: '$tranDate'
        },
        referenceType: {
          $last: "$referenceType"
        },
        totalUsd: {
          $sum: "$totalUsd"
        },
        totalKhr: {
          $sum: "$totalKhr"
        },
      }
    },
    {
      $sort: {
        _id: -1
      }
    }
  ])
  return data
}