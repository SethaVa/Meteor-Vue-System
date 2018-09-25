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
import ViewSubject from '/imports/modules/school/api/views/subjects'


// Find
export const findSubject = new ValidatedMethod({
  name: 'sch.findSubject',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      Meteor._sleepForMs(500)
      selector = selector || {}
      options = options || {}

      // return aggregateSubject(selector)
      return ViewSubject.find(selector, options).fetch()
    }
  },
})



//find for Options
export const findSubjectOpts = new ValidatedMethod({
  name: 'sch.findSubjectOpts',
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
  name: 'sch.findOneSubject',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector:{
      type:Object,
      blackbox:true,
    }
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}

      return Subject.findOne(selector)
    }
  },
})

// Insert
export const insertSubject = new ValidatedMethod({
  name: 'sch.insertSubject',
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
  name: 'sch.updateSubject',
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
  name: 'sch.removeSubject',
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