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

import rateLimit from '/imports/utils/rate-limit'
import {
  throwError
} from '/imports/utils/security'
import getNextSeq from '/imports/utils/get-next-seq'



import Position from './position'

// Find All Data
export const findPosition = new ValidatedMethod({
  name: 'sch.findPosition',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true
    }
  }).validator(),
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Position.find(selector, options).fetch()
    }
  },
})

// find One
export const findOnePosition = new ValidatedMethod({
  name: 'sch.findOnePosition',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      return Position.findOne(_id)
    }
  },
})
//=============================================
// Insert
//=============================================
export const insertPosition = new ValidatedMethod({
  name: 'sch.insertPosition',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Position.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      const _id = getNextSeq({
        // Mandatory
        _id: `sch_position`,
        // Optional
        opts: {
          seq: 1,
          paddingType: 'start',
          paddingLength: 3,
          paddingChar: '0',
          // prefix: `${doc.branchId}-`,
        },
      })
      try {
        doc._id = _id
        Position.insert(doc)
        return 'success'
      } catch (error) {
        getNextSeq({
          // filter: {
          _id: 'sch_position',
          // },
          opts: {
            seq: -1,
          },
        })
        Position.remove({
          _id: _id,
        })
        throwError(error)
      }
    }
  }
})
// Update
export const updatePosition = new ValidatedMethod({
  name: 'sch.updatePosition',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Position.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      return Position.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

// Delete
export const removePosition = new ValidatedMethod({
  name: 'sch.removePosition',
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
      return Position.remove(_id)
    }
  },
})

rateLimit({
  method: [findOnePosition, findPosition, insertPosition, updatePosition, removePosition]
})