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
import _ from 'lodash'
import moment from 'moment'

import {
  throwError
} from '/imports/utils/security'
import rateLimit from '/imports/utils/rate-limit'
import getNextSeq from '/imports/utils/get-next-seq'

import RateSalary from './rate-salary'



export const findRateSalary = new ValidatedMethod({
  name: 'sch.findRateSalary',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return RateSalary.find(selector).fetch()
    }
  },
})
//find for Part Time Options
export const RateSalaryOpts = new ValidatedMethod({
  name: 'sch.RateSalaryOpts',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector: {
      type: Object,
      blackbox: true,
      optional: true
    }
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let RateSalary = RateSalary.find(selector).fetch()
      _.forEach(RateSalary, o => {
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


export const findOneRateSalary = new ValidatedMethod({
  name: 'sch.findOneRateSalary',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return RateSalary.findOne({
        _id: id
      })
    }
  },
})

export const insertRateSalary = new ValidatedMethod({
  name: 'sch.insertRateSalary',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc: RateSalary.schema
  }).validator(),
  run({
    doc
  }) {
    if (Meteor.isServer) {
      const _id = getNextSeq({
        // Mandatory
        _id: `sch_rateSalary`,
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
        RateSalary.insert(doc)
        return 'success'
      } catch (err) {
        getNextSeq({
          // filter: {
          _id: 'sch_rateSalary',
          // },
          opts: {
            seq: -1,
          },
        })
        RateSalary.remove({
          _id: _id,
        })
        throwError(err)
      }
    }
  },
})

export const updateRateSalary = new ValidatedMethod({
  name: 'sch.updateRateSalary',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    doc:RateSalary.schema
  }).validator() ,
  run({doc}) {
    if (Meteor.isServer) {
      return RateSalary.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeRateSalary = new ValidatedMethod({
  name: 'sch.removeRateSalary',
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
      return RateSalary.remove(_id)
    }
  },
})

rateLimit({
  method: [findOneRateSalary, findRateSalary, RateSalaryOpts, insertRateSalary, updateRateSalary, removeRateSalary]
})