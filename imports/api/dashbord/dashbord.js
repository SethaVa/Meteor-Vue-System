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

// Find Student to show in dash bord
export const findStudentByType = new ValidatedMethod({
  name: 'findStudentByType',
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