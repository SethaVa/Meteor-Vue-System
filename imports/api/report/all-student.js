import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import moment from 'moment'
import Student from '../../api/students/students'

// Find Salay
export const reportStudents = new ValidatedMethod({
  name: 'reportStudents',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    periodDate: Array,
    'periodDate.$': Date,
    type: Array,
    'type.$': String,
  }).validator(),
  run({ periodDate, type }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(500)
      // selector = selector || {}
      let fDate = periodDate[0]
      let lDate = periodDate[1]
      let match = {
        registerDate: {
          $gte: moment(fDate)
            .startOf('day')
            .toDate(),
          $lte: moment(lDate)
            .endOf('day')
            .toDate(),
        },
        type: { $in: type },
        remove: false,
      }
      let data = Student.aggregate([
        {
          $match: match,
        },
        {
          $sort:{_id:-1}
        }
      ])
      return data
    }
  },
})
// // Find Salary
// const aggregateSalary = selector => {
//   selector = selector || {}
//   let data = Sturn.aggregate([
//     {
//       $match: selector,
//     },
//     {
//       $lookup: {
//         from: 'payment',
//         localField: 'refId',
//         foreignField: '_id',
//         as: 'paymentDoc',
//       },
//     },
//     {
//       $unwind: {
//         path: '$paymentDoc',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: 'classStudy',
//         localField: 'paymentDoc.classId',
//         foreignField: '_id',
//         as: 'classDoc',
//       },
//     },
//     {
//       $unwind: {
//         path: '$classDoc',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: 'staff',
//         localField: 'classDoc.staffId',
//         foreignField: '_id',
//         as: 'staffDoc',
//       },
//     },
//     {
//       $unwind: {
//         path: '$staffDoc',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: 'position',
//         localField: 'staffDoc.positionId',
//         foreignField: '_id',
//         as: 'positionDoc',
//       },
//     },
//     {
//       $unwind: {
//         path: '$positionDoc',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $lookup: {
//         from: 'salaryRate',
//         localField: 'classDoc.rateId',
//         foreignField: '_id',
//         as: 'rateDoc',
//       },
//     },
//     {
//       $unwind: {
//         path: '$rateDoc',
//         preserveNullAndEmptyArrays: true,
//       },
//     },
//     {
//       $group: {
//         _id: '$_id',
//         tranDate: {
//           $last: '$tranDate',
//         },
//         refId: {
//           $last: '$refId',
//         },
//         refType: {
//           $last: '$refType',
//         },
//         type: {
//           $last: '$type',
//         },
//         classId: {
//           $last: '$classDoc._id',
//         },
//         staffId: {
//           $last: '$staffDoc._id',
//         },
//         name: {
//           $last: '$staffDoc.name',
//         },
//         gender: {
//           $last: '$staffDoc.gender',
//         },
//         position: {
//           $last: '$positionDoc.position',
//         },
//         rate: {
//           $last: '$rateDoc.partTime',
//         },
//         rateFull: {
//           $last: '$rateDoc.fullTime',
//         },
//         payDate: {
//           $last: '$payDate',
//         },
//         pay: {
//           $last: '$pay',
//         },
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         tranDate: 1,
//         payDate: 1,
//         name: 1,
//         gender: 1,
//         position: 1,
//         staffId: 1,
//         classId: 1,
//         refId: 1,
//         rate: 1,
//         rateFull: 1,
//         pay: 1,
//         type: 1,
//         refType: 1,
//         // fullSalary: {
//         //     $cond: {
//         //         if: {
//         //             $eq: ['$type', 'Full Time']
//         //         },
//         //         then: {
//         //             $multiply: [1, '$rateFull']
//         //         },
//         //         else: 0,
//         //     },
//         // },
//         // partSalary: {
//         //     $cond: {
//         //         if: {
//         //             $eq: ['$type', 'Part Time']
//         //         },
//         //         then: {
//         //             $multiply: ['$pay', {
//         //                 $divide: ['$rate', 100]
//         //             }]
//         //         },
//         //         else: 0,
//         //     },
//         // },
//         totalSalary: {
//           $sum: [
//             {
//               $cond: {
//                 if: {
//                   $eq: ['$type', 'Full Time'],
//                 },
//                 then: {
//                   $multiply: [1, '$rateFull'],
//                 },
//                 else: 0,
//               },
//             },
//             {
//               $cond: {
//                 if: {
//                   $eq: ['$type', 'Part Time'],
//                 },
//                 then: {
//                   $multiply: [
//                     '$pay',
//                     {
//                       $divide: ['$rate', 100],
//                     },
//                   ],
//                 },
//                 else: 0,
//               },
//             },
//           ],
//         },
//       },
//     },
//     {
//       $group: {
//         _id: {
//           staffId: '$staffId',
//           // classId: '$classId'
//         },
//         tranDate: {
//           $last: '$tranDate',
//         },
//         payDate: {
//           $last: '$payDate',
//         },
//         type: {
//           $last: '$type',
//         },
//         name: {
//           $last: '$name',
//         },
//         gender: {
//           $last: '$gender',
//         },
//         position: {
//           $last: '$position',
//         },
//         staffId: {
//           $last: '$staffId',
//         },
//         classId: {
//           $last: '$classId',
//         },
//         totalSalary: {
//           $sum: '$totalSalary',
//         },
//       },
//     },
//   ])
//   return data
// }
