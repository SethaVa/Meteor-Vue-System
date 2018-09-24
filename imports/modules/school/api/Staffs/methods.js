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
import Staff from './staff'
import ClassStudy from '../classStudy/classStudy'
import Payment from '../payment/payment'
import SalaryRate from '../salary-rate/salaryRate'

// Find
export const findStaff = new ValidatedMethod({
  name: 'sch.findStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {

      return aggregateStaff()
    }
  },
})



// Find Staff Detail for Position Teacher
export const findOneStaffDetails = new ValidatedMethod({
  name: 'sch.findOneStaffDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // sort = sort || {_id:-1};
      return aggregatefindStaffDetails(selector)
    }
  },
})

//find for opts
export const findStaffOpts = new ValidatedMethod({
  name: 'sch.findStaffOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      //   selector = selector || {}
      // sort = sort || {_id:-1};
      let data = []
      let staff = aggregateStaff()
      _.forEach(staff, o => {
        data.push({
          label: o.name,
          value: o._id,
        })
      })
      return data
    }
  },
})

// Find One
export const findOneStaff = new ValidatedMethod({
  name: 'sch.findOneStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Staff.findOne(selector, options)
    }
  },
})

//find salary
export const findStaffSalary = new ValidatedMethod({
  name: 'sch.findStaffSalary',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      const salaryRate = SalaryRate.find({}, {
        sort: {
          _id: -1
        },
        limit: 1
      }).fetch()

      let partTiemRate = salaryRate[0].partTime

      // sort = sort || {_id:-1};
      // console.log(aggregateFindStaffSalary(selector, partTiemRate))
      return aggregateFindStaffSalary(selector, partTiemRate)
    }
  },
})

// Insert
export const insertStaff = new ValidatedMethod({
  name: 'sch.insertStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {

      return Staff.insert(doc)
    }
  },
})

// Update
export const updateStaff = new ValidatedMethod({
  name: 'sch.updateStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Staff.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

// Remove
export const removeStaff = new ValidatedMethod({
  name: 'sch.removeStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector) {
    if (Meteor.isServer) {
      return Staff.remove(selector)
    }
  },
})

// Get Staff Position
const aggregateStaff = () => {
  // selector = selector || {};

  let data = Staff.aggregate([
    // {
    //     $match: selector
    // }, 
    {
      $unwind: {
        path: '$positionId',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "position",
        localField: "positionId",
        foreignField: "_id",
        as: "positionDoc"
      }
    },
    {
      $unwind: {
        path: '$positionDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $group: {
        "_id": "$_id",
        "name": {$last:'$name'},
        "gender":{$last:'$gender'},
        "dob": {$last:'$dob'},
        "email": {$last:'$email'},
        "tel": {$last:'$tel'},
        "positionId": {
            $addToSet:{
                positionId:'$positionId'
            }
        },
        position: {
            $addToSet:{
                position:'$positionDoc'
            }
        }
      }
    }
  ])

  return data
}

// For find Teacher Detail
const aggregatefindStaffDetails = selector => {
  let data = ClassStudy.aggregate([{
      $match: selector,
    },
    {
      $lookup: {
        from: 'rooms',
        localField: 'roomId',
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
        localField: 'timeId',
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
        from: 'staff',
        localField: 'staffId',
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
        from: 'subjects',
        localField: 'subId',
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
      $group: {
        _id: '$staffId',
        name: {
          $last: '$staffDoc.name'
        },
        gender: {
          $last: '$staffDoc.gender'
        },
        email: {
          $last: '$staffDoc.email'
        },
        tel: {
          $last: '$staffDoc.tel'
        },
        teacherDetail: {
          $push: {
            room: '$roomDoc.roomName',
            subject: '$subjectDoc.title',
            time: '$timeDoc.timeStudy',
            type: '$type',
            status: '$status',
          },
        },
      },
    },
    // {
    //   $project: {
    //     _id: 1,
    //     name: 1,
    //     gender: 1,
    //     email: 1,
    //     tel: 1,
    //     teacherDetail: 1,
    //   },
    // },
  ])
  return data
}

// Salary Aggregate
const aggregateFindStaffSalary = (selector, rateSalary) => {
  let data = Payment.aggregate([{
      $match: {
        status: 'Paid',
      },
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
      $unwind: {
        path: '$roomDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $unwind: {
        path: '$typeDoc',
        preserveNullAndEmptyArrays: true
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
        from: 'position',
        localField: 'staffDoc.positionId',
        foreignField: '_id',
        as: 'positionDoc',
      },
    },
    {
      $unwind: {
        path: '$positionDoc',
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $group: {
        _id: '$classId',
        classId: {
          $last: '$classDoc._id'
        },
        roomName: {
          $last: '$roomDoc.roomName'
        },
        staffId: {
          $last: '$staffDoc._id'
        },
        staffName: {
          $last: '$staffDoc.name'
        },
        gender: {
          $last: '$staffDoc.gender'
        },
        position: {
          $last: '$positionDoc.position'
        },
        // typeId: { $last: '$typeDoc._id' },
        type: {
          $last: '$type'
        },
        total: {
          $sum: {
            $divide: [{
                $multiply: [
                  '$totalPay',
                  {
                    $divide: [rateSalary, 100],
                  },
                ],
              },
              '$duration',
            ],
          },
        },
      },
    },
    {
      // Type : Full Time , Part Time Id
      $match: selector,
    },
    {
      $group: {
        _id: '$staffId',
        classId: {
          $last: '$classId'
        },
        // roomName:{$last:'$roomName'},
        staffId: {
          $last: '$staffId'
        },
        staffName: {
          $last: '$staffName'
        },
        gender: {
          $last: '$gender'
        },
        position: {
          $last: '$position'
        },
        type: {
          $last: '$type'
        },
        totalSalary: {
          $sum: '$total',
        },
      },
    },
    {
      $project: {
        _id: 1,
        classId: 1,
        staffId: 1,
        staffName: 1,
        gender: 1,
        position: 1,
        typeId: 1,
        type: 1,
        totalSalary: 1,
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ])

  return data
}

// aggregate Staff Report
const aggregateStaffReport = selector => {
  selector = selector || {}
  let data = Staff.aggregate([
    // {
    //     $match: selector
    // },     
    {
      $lookup: {
        from: "position",
        localField: "positionId",
        foreignField: "_id",
        as: "positionDoc"
      }
    },
    {
      $unwind: {
        path: '$positionDoc',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        "_id": 1,
        "name": 1,
        "gender": 1,
        "dob": 1,
        "email": 1,
        "tel": 1,
        "positionId": 1,
        position: '$positionDoc.position'
      }
    }
  ])
  return data
}