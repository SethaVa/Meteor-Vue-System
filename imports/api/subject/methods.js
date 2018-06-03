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
import Subject from './subjects'

// Find
export const findSubject = new ValidatedMethod({
  name: 'findSubject',
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
      return Subject.find(selector, options).fetch()
    }
  },
})



//find for Options
export const findSubjectOpts = new ValidatedMethod({
  name: 'findSubjectOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = []
      let sub = Subject.find(selector, options).fetch()
      _.forEach(sub, o => {
        data.push({
          label: o.title,
          value: o._id,
        })
      })
      return data
    }
  },
})

// Find One
export const findOneSubject = new ValidatedMethod({
  name: 'findOneSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Subject.findOne(selector, options)
    }
  },
})

// Insert
export const insertSubject = new ValidatedMethod({
  name: 'insertSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Subject.insert(doc)
    }
  },
})

// Update
export const updateSubject = new ValidatedMethod({
  name: 'updateSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return Subject.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

// Remove
export const removeSubject = new ValidatedMethod({
  name: 'removeSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run(selector) {
    if (Meteor.isServer) {
      return Subject.remove(selector)
    }
  },
})

const aggregateSubject = selector => {
  let data = Subject.aggregate([{
      $match: selector,
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
      $lookup: {
        from: 'leveleStudy',
        localField: 'levelId',
        foreignField: '_id',
        as: 'levelDoc',
      },
    },
    {
      $unwind: {
        path: '$levelDoc',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: '$_id',
        code: '$code',
        title: '$title',
        levelId: '$levelId',
        typeId: '$typeId',
        type: '$typeDoc.type',
        level: '$levelDoc.leveleStudy',
        status: '$status',
      },
    },
    // {
    //   $sort: { sort },
    // },
  ])
  return data
}