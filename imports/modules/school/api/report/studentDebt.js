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
import Payment from '../payment/payment'



export const findStudentDebt = new ValidatedMethod({
  name: 'sch.findStudentDebt',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(500)
      selector = selector || {}
      return aggregateStudentDebt(selector)
    }
  },
})


const aggregateStudentDebt = selector => {
  let data = Payment.aggregate([{
      $match: selector
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
      $lookup: {
        from: "classStudy",
        localField: "classId",
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
        from: "rooms",
        localField: "classDoc.roomId",
        foreignField: "_id",
        as: "roomDoc"
      }
    },
    {
      $unwind: {
        path: '$roomDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "subjects",
        localField: "classDoc.subId",
        foreignField: "_id",
        as: "subjectDoc"
      }
    },
    {
      $unwind: {
        path: '$subjectDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "timeStudy",
        localField: "classDoc.timeId",
        foreignField: "_id",
        as: "timeDoc"
      }
    },
    {
      $unwind: {
        path: '$timeDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        _id: '$_id',
        tranDate: {
          $last: "$tranDate"
        },
        payDate: {
          $last: "$payDate"
        },
        duration: {
          $last: "$duration"
        },
        endPayDate: {
          $last: "$endPayDate"
        },
        status: {
          $last: "$status"
        },
        type: {
          $last: "$type"
        },
        studentName: {
          $last: "$studentDoc.enName"
        },
        gender: {
          $last: "$studentDoc.gender"
        },
        roomName: {
          $last: "$roomDoc.roomName"
        },
        subject: {
          $last: "$subjectDoc.title"
        },
        timeStudy: {
          $last: "$timeDoc.timeStudy"
        }
      }
    }
  ])
  return data
}