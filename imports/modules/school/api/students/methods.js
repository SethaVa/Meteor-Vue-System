import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'
import SimpleSchema from 'simpl-schema'

import {
  throwError
} from '/imports/utils/security'
import getNextSeq from '/imports/utils/get-next-seq'

import Students from './students'

// Find All Data
export const findStudents = new ValidatedMethod({
  name: 'sch.findStudents',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    option
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {
        sort: {
          _id: -1
        }
      }

      return Students.find(selector, option).fetch()
    }
  },
})

// Find All Data
export const findStudentsByDate = new ValidatedMethod({
  name: 'sch.findStudentsByDate',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    option
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      option = option || {}

      return aggregateFindByDate(selector)
    }
  },
})

// find One
export const findOneStudent = new ValidatedMethod({
  name: 'sch.findOneStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run(_id) {
    if (Meteor.isServer) {
      return Students.findOne(_id)
    }
  },
})

// Insert
export const insertStudent = new ValidatedMethod({
  name: 'sch.insertStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Students.schema,
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {

      const _id = getNextSeq({
        // Mandatory
        _id: `sch_students${doc.branchId}`,
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
        Students.insert(doc)
        return _id
      } catch (error) {
        // Decrement seq
        getNextSeq({
          // filter: {
          _id: 'sch_students',
          // },
          opts: {
            seq: -1,
          },
        })
        Students.remove({
          _id: _id,
        })
        throwError(error)
      }
    }
  },
})

// Update
export const updateStudent = new ValidatedMethod({
  name: 'sch.updateStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Students.schema,
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      Students.update({
        _id: doc._id,
      }, {
        $set: doc,
      })
      return 'Success'
    }
  },
})

// Delete
export const removeStudent = new ValidatedMethod({
  name: 'sch.removeStudent',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String,
    },
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      Students.update({
        _id: _id,
      }, {
        $set: {
          remove: true,
        },
      })
      return 'Success'
      // return Students.remove(selector)
    }
  },
})

// find student by date
const aggregateFindByDate = selector => {
  selector = selector || {}
  let data = Students.aggregate([{
      $match: selector,
    },
    {
      $project: {
        _id: 1,
        registerDate: {
          $dateToString: {
            format: '%Y-%m-%d',
            date: '$registerDate',
          },
        },
        type: 1,
        khName: 1,
        enName: 1,
        gender: 1,
        dob: 1,
        tel: 1,
        remove: 1,
      },
    },
  ])

  return data
}