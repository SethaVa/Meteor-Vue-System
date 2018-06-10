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
import ExchagneClass from '../exchange-class/exchange-class'

import moment from 'moment'

export const findExchangeStudents = new ValidatedMethod({
  name: 'findExchangeStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(500)
      let sDate = moment(selector.opts[0]).startOf('day').toDate()
      let eDate = moment(selector.opts[1]).endOf('day').toDate()
      let query = {
        tranDate:{
          $gte:sDate,
          $lte:eDate
        }
      }
      
      return aggregateTeacherDetails(query)
    }
  },
})


const aggregateTeacherDetails = selector => {
  
  let data = ExchagneClass.aggregate([{
      $match: selector
    },
    {
      $lookup: {
        from: "classStudy",
        localField: "classFromId",
        foreignField: "_id",
        as: "classFromDoc"
      }
    },
    {
      $unwind: {
        path: '$classFromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "classFromDoc.roomId",
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
        from: "subjects",
        localField: "classFromDoc.subId",
        foreignField: "_id",
        as: "subjectFromDoc"
      }
    },
    {
      $unwind: {
        path: '$subjectFromDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "classStudy",
        localField: "classToId",
        foreignField: "_id",
        as: "classToDoc"
      }
    },
    {
      $unwind: {
        path: '$classToDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "rooms",
        localField: "classToDoc.roomId",
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
        from: "subjects",
        localField: "classToDoc.subId",
        foreignField: "_id",
        as: "subjectToDoc"
      }
    },
    {
      $unwind: {
        path: '$subjectToDoc',
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
      $group: {
        _id: '$_id',
        tranDate: {
          $last: "$tranDate"
        },
        classFromId: {
          $last: "$classFromId"
        },
        classFromName: {
          $last: "$roomFromDoc.roomName"
        },
        subjectFrom: {
          $last: "$subjectFromDoc.title"
        },
        classToId: {
          $last: "$classToId"
        },
        classToName: {
          $last: "$roomToDoc.roomName"
        },
        subjectTo: {
          $last: "$subjectToDoc.title"
        },
        name: {
          $last: "$studentDoc.enName"
        },
        gender: {
          $last: "$studentDoc.gender"
        },
        typeFrom: {
          $last: "$classFromDoc.type"
        },
        typeTo: {
          $last: "$classToDoc.type"
        }
      }
    }
  ])
  return data
}