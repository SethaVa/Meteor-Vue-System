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
import SalaryRate from './salaryRate'

export const findSalaryRate = new ValidatedMethod({
  name: 'sch.findSalaryRate',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return SalaryRate.find(selector, {
        sort: {
          _id: -1
        },
        // limit: 1
      }).fetch()
    }
  },
})
//find for Part Time Options
export const findSalaryRatePartTimeOpts = new ValidatedMethod({
  name: 'sch.findSalaryRatePartTimeOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let salaryRate = SalaryRate.find(selector, {
        sort: {
          _id: -1
        },
        limit: 8
      }).fetch()

      _.forEach(salaryRate, o => {
        data.push({
          label: o._id + ' - ' + o.partTime + ' %',
          value: o._id,
        })
      })

      return data
    }
  },
})

//find for Full Time Options
export const findSalaryRateFullTimeTimeOpts = new ValidatedMethod({
  name: 'sch.findSalaryRateFullTimeTimeOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let salaryRate = SalaryRate.find(selector, {
        sort: {
          _id: -1
        },
        limit: 8
      }).fetch()

      _.forEach(salaryRate, o => {
        data.push({
          label: o._id + ' - ' + o.fullTime + ' $',
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneSalaryRate = new ValidatedMethod({
  name: 'sch.findOneSalaryRate',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return SalaryRate.findOne({
        _id: id
      })
    }
  },
})

export const insertSalaryRate = new ValidatedMethod({
  name: 'sch.insertSalaryRate',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return SalaryRate.insert(doc)
    }
  },
})

export const updateSalaryRate = new ValidatedMethod({
  name: 'sch.updateSalaryRate',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return SalaryRate.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeSalaryRate = new ValidatedMethod({
  name: 'sch.removeSalaryRate',
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
      return SalaryRate.remove(_id)
    }
  },
})