import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import Staff from './staff'
import ClassStudy from '../classStudy/classStudy'
// Find
export const findStaff = new ValidatedMethod({
  name: 'findStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      // selector = selector || {};
      // sort = sort || {_id:-1};

      return aggregateStaff()
    }
  },
})

// Find Staff Detail for Position Teacher
export const findStaffDetails = new ValidatedMethod({
  name: 'findStaffDetails',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // sort = sort || {_id:-1};

      return aggregatefindStaffDetails(selector)
    }
  },
})

//find for opts
export const findStaffOpts = new ValidatedMethod({
  name: 'findStaffOpts',
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
  name: 'findOneStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Staff.findOne(selector, options)
    }
  },
})

// Insert
export const insertStaff = new ValidatedMethod({
  name: 'insertStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      try {
        Staff.insert(doc, (error, result) => {})
      } catch (e) {
        throw Meteor.Error('Insert Staff', 'Can not Insert', e)
      }
    }
  },
})

// Update
export const updateStaff = new ValidatedMethod({
  name: 'updateStaff',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Staff.update({ _id: doc._id }, { $set: doc })
    }
  },
})

// Remove
export const removeStaff = new ValidatedMethod({
  name: 'removeStaff',
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
    //     $match:{selector}
    // },
    {
      $lookup: {
        from: 'position',
        localField: 'positionId',
        foreignField: '_id',
        as: 'Position',
      },
    },
    {
      $unwind: {
        path: '$Position',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        name: '$name',
        gender: '$gender',
        dob: '$dob',
        email: '$email',
        tel: '$tel',
        position: '$Position.position',
      },
    },
  ])

  return data
}

// For find Teacher Detail
const aggregatefindStaffDetails = selector => {
  let data = ClassStudy.aggregate([
    {
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
      $lookup: {
        from: 'types',
        localField: 'typeId',
        foreignField: '_id',
        as: 'typeDoc',
      },
    },
    {
      $unwind: {
        path: '$typeDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$staffId',
        name: { $last: '$staffDoc.name' },
        gender: { $last: '$staffDoc.gender' },
        teacherDetail: {
          $push: {
            room: '$roomDoc.roomName',
            subject: '$subjectDoc.title',
            time: '$timeDoc.timeStudy',
            type: '$typeDoc.type',
            status: '$status',
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        gender: 1,
        teacherDetail: 1,
      },
    },
  ])
  return data
}
