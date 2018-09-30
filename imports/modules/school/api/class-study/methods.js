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

import {
  throwError
} from '/imports/utils/security'
import rateLimit from '/imports/utils/rate-limit'
import getNextSeq from '/imports/utils/get-next-seq'


import ClassStudy from './class-study'
import ClassView from '/imports/modules/school/api/views/class-study'
export const findClassStudy = new ValidatedMethod({
  name: 'sch.findClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector:{
      type:Object,
      blackbox:true,
      optional:true
    }
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return ClassView.find(selector).fetch()
      // return aggregateFindClassStudy(selector)
    }
  },
})

export const findOneClassStudy = new ValidatedMethod({
  name: 'sch.findOneClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
    }
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      return ClassStudy.findOne(selector)
    }
  },
})


//insert
export const insertClassStudy = new ValidatedMethod({
  name: 'sch.insertclassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: ClassStudy.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      const _id = getNextSeq({
        // Mandatory
        _id: `sch_classStudy${doc.branchId}`,
        // Optional
        opts: {
          seq: 1,
          // paddingType: 'start',
          // paddingLength: 6,
          // paddingChar: '0',
          prefix: `${doc.branchId}-`,
        },
      })
      try {
        doc._id = _id
        ClassStudy.insert(doc)
        return _id
      } catch (error) {
        // Decrement seq
        getNextSeq({
          // filter: {
          _id: 'sch_classStudy',
          // },
          opts: {
            seq: -1,
          },
        })
        ClassStudy.remove({
          _id: _id,
        })
        throwError(error)
      }
    }
  },
})
export const updateClassStudy = new ValidatedMethod({
  name: 'sch.updateClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: ClassStudy.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      ClassStudy.update({
        _id: doc._id
      }, {
        $set: doc
      })
      return 'success'
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