import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'


import Students from '../students/students'
import Staff from '../staffs/staff'
import Room from '../rooms/room'
import Subject from '../subject/subjects'
import ClassStudy from '../class-study/class-study'
import Payment from '../payment/payment'


// Find Student to show in dash bord
export const findStudentByType = new ValidatedMethod({
  name: 'sch.findStudentByType',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      // selector = selector || {}
      // return ClassStudy.find(selector).fetch()
      return aggregateStudentByType()
    }
  },
})

//count Class
export const countClass = new ValidatedMethod({
  name: 'sch.countClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // return ClassStudy.find(selector).fetch()
      return ClassStudy.find(selector).count()
    }
  },
})



// Count Staff
export const countStaff = new ValidatedMethod({
  name: 'sch.countStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {

      return Staff.find({}).count()
    }
  },
})

// Find All Data
export const countRoom = new ValidatedMethod({
  name: 'sch.countRoom',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    option
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return Room.find(selector, option).count()
    }
  },
})


// Find All Data
export const countStudents = new ValidatedMethod({
  name: 'sch.countStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {
        remove: false
      }

      return Students.find(selector).count()
    }
  },
})

// Find
export const countSubject = new ValidatedMethod({
  name: 'sch.countSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      // return aggregateSubject(selector)
      return Subject.find(selector, options).count()
    }
  },
})

// Find
export const countPayment = new ValidatedMethod({
  name: 'sch.countPayment',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}

      return Payment.find(selector).count()
    }
  },
})


const aggregateStudentByType = () => {
  let data = Students.aggregate([{
      $match: {
        'remove': false
      }
    },
    {
      $project: {
        registerDate: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$registerDate"
          }
        },
        "_id": 1,
        "type": 1,
        "khName": 1,
        "enName": 1,
        "gender": 1,
        "dob": 1,
        "tel": 1,
        "remove": 1,
        partTime: {
          $cond: {
            if: {
              $eq: ['$type', 'Part Time']
            },
            then: {
              $sum: 1
            },
            else: 0,
          },
        },
        femalePartTime: {
          $cond: {
            if: {
              $and: [{
                $eq: ['$type', 'Part Time']
              }, {
                $eq: ['$gender', 'Female']
              }]

            },
            then: {
              $sum: 1
            },
            else: 0,
          },
        },
        fullTime: {
          $cond: {
            if: {
              $eq: ['$type', 'Full Time']
            },
            then: {
              $sum: 1
            },
            else: 0,
          },
        },
        femaleFullTime: {
          $cond: {
            if: {
              $and: [{
                $eq: ['$type', 'Full Time']
              }, {
                $eq: ['$gender', 'Female']
              }]
            },
            then: {
              $sum: 1
            },
            else: 0,
          },
        }
      }
    },
    {
      $group: {
        _id: '$registerDate',
        totalPartTime: {
          $sum: '$partTime'
        },
        totalPFemale: {
          $sum: '$femalePartTime'
        },
        totalFullTime: {
          $sum: '$fullTime'
        },
        totalFFemale: {
          $sum: '$femaleFullTime'
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ])
  return data
}