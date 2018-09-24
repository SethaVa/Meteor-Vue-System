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

import rateLimit from '/imports/utils/rate-limit'
import {
  throwError
} from '/imports/utils/security'
import getNextSeq from '/imports/utils/get-next-seq'

import level from './level'


export const findLevel = new ValidatedMethod({
  name: 'sch.findlevel',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = level.find(selector, options).fetch()
      return data
    }
  },
})
//find for Options
export const levelOpts = new ValidatedMethod({
  name: 'sch.levelOpts',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector:{
      type:Object,
      blackbox:true,
      optional:true
    },
    options:{
      type:Object,
      blackbox:true,
      optional:true
    }
  }).validator(),
  run({
    selector,
    options
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = []
      let level = level.find(selector, options).fetch()
      _.forEach(level, o => {
        data.push({
          label: o.level,
          value: o._id,
          doc:o
        })
      })
      return data
    }
  },
})

export const findOneLevel = new ValidatedMethod({
  name: 'sch.findOneLevel',
  mixins: [CallPromiseMixin],
  validate: null,
  run(id) {
    if (Meteor.isServer) {
      return level.findOne({
        _id: id
      })
    }
  },
})

export const insertLevel = new ValidatedMethod({
  name: 'sch.insertLevel',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: level.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      const _id = getNextSeq({
        // Mandatory
        _id: `sch_level`,
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
        level.insert(doc)
        return 'success'
      } catch (error) {
        getNextSeq({
          // filter: {
          _id: 'sch_level',
          // },
          opts: {
            seq: -1,
          },
        })
        level.remove({
          _id: _id,
        })
        throwError(error)
      }
    }
  },
})

export const updateLevel = new ValidatedMethod({
  name: 'sch.updateLevel',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: level.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      return level.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeLevel = new ValidatedMethod({
  name: 'sch.removeLevel',
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
      return level.remove({
        _id
      })
    }
  },
})

