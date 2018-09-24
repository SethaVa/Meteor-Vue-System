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

import ClassStudy from './classStudy'

export const findClassStudy = new ValidatedMethod({
  name: 'sch.findClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      // return ClassStudy.find(selector).fetch()
      return aggregateFindClassStudy(selector)
    }
  },
})


export const findOneClassStudy = new ValidatedMethod({
  name: 'sch.findOneClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return ClassStudy.findOne({
        _id: id
      })
    }
  },
})

//insert
export const insertClassStudy = new ValidatedMethod({
  name: 'sch.insertclassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      ClassStudy.insert(doc)
    }
  },
})
export const updateClassStudy = new ValidatedMethod({
  name: 'sch.updateClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return ClassStudy.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const updateClassStudyStatus = new ValidatedMethod({
  name: 'sch.updateClassStudyStatus',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String,
    status: String
  }).validator(),
  run({
    _id,
    status
  }) {
    if (Meteor.isServer) {
      return ClassStudy.update({
        _id: _id
      }, {
        $set: {
          status: status
        }
      })
    }
  },
})


export const removeClassStudy = new ValidatedMethod({
  name: 'sch.removeClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String
    },
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      return ClassStudy.remove(_id)
    }
  },
})

// finish the class
export const finishClassStudy = new ValidatedMethod({
  name: 'sch.finishClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String
    },
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      ClassStudy.update(_id, {
        $set: {
          status: 'Closed'
        }
      })
      return 'Success'
    }
  },
})

const aggregateFindClassStudy = selector => {
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
    // {
    //   $lookup: {
    //     from: 'types',
    //     localField: 'typeId',
    //     foreignField: '_id',
    //     as: 'typeDoc',
    //   },
    // },
    // {
    //   $unwind: {
    //     path: '$typeDoc',
    //     preserveNullAndEmptyArrays: true,
    //   },
    // },
    {
      $project: {
        _id: '$_id',
        classDate: '$classDate',
        roomId: '$roomId',
        roomname: 'sch.$roomDoc.roomName',
        timeId: '$timeId',
        timeStudy: '$timeDoc.timeStudy',
        staffId: '$staffId',
        teacher: '$staffDoc.name',
        subId: '$subId',
        subject: '$subjectDoc.title',
        type: '$type',
        rateId: '$rateId',
        status: '$status',
      },
    },
  ])
  return data
}