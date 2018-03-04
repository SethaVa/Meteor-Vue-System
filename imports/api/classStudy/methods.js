import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import ClassStudy from './classStudy'
export const findClassStudy = new ValidatedMethod({
  name: 'findClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // return ClassStudy.find(selector).fetch()
      return aggregateFindClassStudy()
    }
  },
})

export const findOneClassStudy = new ValidatedMethod({
  name: 'findOneClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      return ClassStudy.findOne({ _id: id })
    }
  },
})

//insert
export const insertClassStudy = new ValidatedMethod({
  name: 'insertclassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      ClassStudy.insert(doc)
    }
  },
})
export const updateClassStudy = new ValidatedMethod({
  name: 'updateClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return ClassStudy.update({ _id: doc._id }, { $set: doc })
    }
  },
})

export const removeClassStudy = new ValidatedMethod({
  name: 'removeClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return ClassStudy.remove(_id)
    }
  },
})

const aggregateFindClassStudy = () => {
  let data = ClassStudy.aggregate([
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
      $project: {
        _id: '$_id',
        classDate: '$classDate',
        roomId: '$roomId',
        roomName: '$roomDoc.roomName',
        timeId: '$timeId',
        timeStudy: '$timeDoc.timeStudy',
        staffId: '$staffId',
        teacher: '$staffDoc.name',
        subId: '$subId',
        subject: '$subjectDoc.title',
        typeId: '$typeId',
        type: '$typeDoc.type',
        status: '$status',
      },
    },
  ])
  return data
}
