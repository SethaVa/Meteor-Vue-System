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
import ClassStudy from '../classStudy/classStudy'



export const findTeacherDetails = new ValidatedMethod({
  name: 'findTeacherDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return aggregateTeacherDetails(selector)
    }
  },
})


const aggregateTeacherDetails = selector => {
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
  ])
  return data
}