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
import ExchangeClass from './exchange-class'
import Students from '../students/students'


import {
  insertPaymentFromExchangeClass,
  removePaymentFromECC
} from '../payment/methods'

export const findExchangeClass = new ValidatedMethod({
  name: 'findExchangeClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // return ExchangeClass.find(selector).fetch()
      return aggregateShowExchangeClass(selector)
    }
  },
})
//find for Options
export const findExchangeClassOpts = new ValidatedMethod({
  name: 'findExchangeClassOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let ExchangeClass = ExchangeClass.find(selector).fetch()

      _.forEach(ExchangeClass, o => {
        data.push({
          label: o.ExchangeClass,
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneExchangeClass = new ValidatedMethod({
  name: 'findOneExchangeClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      // return ExchangeClass.findOne({
      //   _id: id
      // })
      let selector = {
        _id: id
      }
      return aggregateForFindOne(selector)[0]
    }
  },
})

export const insertExchangeClass = new ValidatedMethod({
  name: 'insertExchangeClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    doc,
    details
  }) {
    if (Meteor.isServer) {
      let data = {
        tranDate: doc.tranDate,
        classFromId: doc.classFromId,
        classToId: doc.classToId,
        studentId: doc.studentId
      }
      ExchangeClass.insert(data, (error, exId) => {
        // update student status
        Students.update({
          _id: doc.studentId
        }, {
          $set: {
            type: doc.typeTo
          }
        })
        //
        let data = {
          refId: exId,
          tranDate: doc.tranDate,
          fee: details.fee,
          payDate: details.payDate,
          duration: details.duration,
          endPayDate: details.endPayDate,
          totalPay: details.totalPay,
          discountVal: details.discountVal,
          usd: details.usd,
          khr: details.khr,
          totalRecieve: details.totalRecieve,
          remaining: details.remaining,
          // ECC= Exchange Class
          refType: 'ECC',
          classId: doc.classToId,
          studentId: details.studentId,
          type: doc.typeTo,
          paymentId: details._id,
          status: details.status
        }
        insertPaymentFromExchangeClass.run({
          doc: data
        })
      })
      return 'Success'
    }
  },
})

export const updateExchangeClass = new ValidatedMethod({
  name: 'updateExchangeClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    doc,
    details
  }) {
    if (Meteor.isServer) {
      let studentId = doc.studentId
      let exId = doc._id
      let typeTo = doc.typeTo
      let data = {
        refId: exId,
        tranDate: doc.tranDate,
        fee: details.fee,
        payDate: details.payDate,
        duration: details.duration,
        endPayDate: details.endPayDate,
        totalPay: details.totalPay,
        discountVal: details.discountVal,
        usd: details.usd,
        khr: details.khr,
        totalRecieve: details.totalRecieve,
        remaining: details.remaining,
        // ECC= Exchange Class
        refType: 'ECC',
        classId: doc.classToId,
        studentId: details.studentId,
        type: doc.typeTo,
        paymentId: details._id,
        status: details.status
      }
      ExchangeClass.update({
        _id: exId
      }, {
        $set: doc
      }, error => {
        if (!error) {
          //===================
          let selector = {
            refId: exId
          }
          removePaymentFromECC.run({
            selector
          })


          // to Payment
          insertPaymentFromExchangeClass.run({
            doc: data
          })

          // Update Student 
          Students.update({
            _id: studentId
          }, {
            $set: {
              type: typeTo
            }
          })
        }
      })

      return 'success'
    }
  },
})

export const removeExchangeClass = new ValidatedMethod({
  name: 'removeExchangeClass',
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
      // let data = ExchangeClass.findOne(_id)
      ExchangeClass.remove(_id, error => {
        if (!error) {
          let selector = {
            refId: _id
          }
          removePaymentFromECC.run({
            selector
          })
        }
      })

      return 'success';
    }
  },
})

const aggregateShowExchangeClass = (selector) => {
  selector = selector || {}
  let data = ExchangeClass.aggregate([{
      $lookup: {
        from: "classStudy",
        localField: "classFromId",
        foreignField: "_id",
        as: "fromDoc"
      }
    },
    {
      $unwind: {
        path: '$fromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "classStudy",
        localField: "classToId",
        foreignField: "_id",
        as: "toDoc"
      }
    },
    {
      $unwind: {
        path: '$toDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "fromDoc.roomId",
        foreignField: "_id",
        as: "roomFromDoc"
      }
    },
    {
      $unwind: {
        path: '$roomFromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "toDoc.roomId",
        foreignField: "_id",
        as: "roomToDoc"
      }
    },
    {
      $unwind: {
        path: '$roomToDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "students",
        localField: "studentId",
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
      $project: {
        _id: 1,
        tranDate: 1,
        classFromId: 1,
        classToId: 1,
        studentId: 1,
        type: '$fromDoc.type',
        name: '$studentDoc.enName',
        fromRoom: '$roomFromDoc.roomName',
        toRoom: '$roomToDoc.roomName',
      }
    }
  ])
  return data
}


// aggregate findl  One
const aggregateForFindOne = (selector) => {
  selector = selector || {}
  let data = ExchangeClass.aggregate([{
      $lookup: {
        from: "classStudy",
        localField: "classFromId",
        foreignField: "_id",
        as: "fromDoc"
      }
    },
    {
      $unwind: {
        path: '$fromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "classStudy",
        localField: "classToId",
        foreignField: "_id",
        as: "toDoc"
      }
    },
    {
      $unwind: {
        path: '$toDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "fromDoc.roomId",
        foreignField: "_id",
        as: "roomFromDoc"
      }
    },
    {
      $unwind: {
        path: '$roomFromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "toDoc.roomId",
        foreignField: "_id",
        as: "roomToDoc"
      }
    },
    {
      $unwind: {
        path: '$roomToDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        tranDate: 1,
        classFromId: 1,
        classToId: 1,
        studentId: 1,
        type: '$fromDoc.type',
        typeTo: '$toDoc.type'
      }
    }
  ])
  return data
}