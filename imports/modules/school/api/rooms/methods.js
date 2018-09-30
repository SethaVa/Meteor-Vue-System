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


import Room from './room'
import _ from 'lodash'
// Find All Data
export const findRoom = new ValidatedMethod({
  name: 'sch.findRoom',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true,
    },
    options: {
      type: Object,
      blackbox: true,
      optional: true,
    }
  }).validator(),
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}

      return Room.find(selector, options).fetch()
    }
  },
})



// find One
export const findOneRoom = new ValidatedMethod({
  name: 'sch.findOneRoom',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: String
  }).validator(),
  run({
    _id
  }) {
    if (Meteor.isServer) {
      return Room.findOne(_id)
    }
  },
})

// Find Data Fro Options
export const findRoomOpts = new ValidatedMethod({
  name: 'sch.findRoomOpts',
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
  run(selector, options) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = []
      let room = Room.find(selector, options).fetch()
      _.forEach(room, o => {
        data.push({
          label: o.name,
          value: o._id,
          doc: o
        })
      })
      return data
    }
  },
})

// Insert
export const insertRoom = new ValidatedMethod({
  name: 'sch.insertRoom',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Room.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      const _id = getNextSeq({
        // Mandatory
        _id: `sch_rooms`,
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
        Room.insert(doc)
        return 'success'
      } catch (error) {
        getNextSeq({
          // filter: {
          _id: 'sch_room',
          // },
          opts: {
            seq: -1,
          },
        })
        Room.remove({
          _id: _id,
        })
        throwError(error)
      }
    }
  },
})
// Update
export const updateRoom = new ValidatedMethod({
  name: 'sch.updateRoom',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: Room.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      return Room.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

// Delete
export const removeRoom = new ValidatedMethod({
  name: 'sch.removeRoom',
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
      return Room.remove(_id)
    }
  },
})

rateLimit({
  methods: [findOneRoom, findRoom, findRoomOpts, insertRoom, updateRoom, removeRoom]
})