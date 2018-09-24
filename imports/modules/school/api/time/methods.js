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
import moment from 'moment'
import TimeStudy from './times'

export const findTimeStudy = new ValidatedMethod({
  name: 'sch.findTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return TimeStudy.find(selector, {
        sort: {
          _id: -1
        }
      }).fetch()
    }
  },
})
//find for Options
export const findTimeStudyOpts = new ValidatedMethod({
  name: 'sch.findTimeStudyOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let timeStudy = TimeStudy.find(selector).fetch()

      _.forEach(timeStudy, o => {
        data.push({
          label: o.timeStudy,
          value: o._id,
        })
      })

      return data
    }
  },
})

export const findOneTimeStudy = new ValidatedMethod({
  name: 'sch.findOneTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    id
  }) {
    if (Meteor.isServer) {
      return TimeStudy.findOne({
        _id: id
      })
    }
  },
})

export const insertTimeStudy = new ValidatedMethod({
  name: 'sch.insertTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return TimeStudy.insert(doc)
    }
  },
})

export const updateTimeStudy = new ValidatedMethod({
  name: 'sch.updateTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return TimeStudy.update({
        _id: doc._id
      }, {
        $set: doc
      })
    }
  },
})

export const removeTimeStudy = new ValidatedMethod({
  name: 'sch.removeTimeStudy',
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
      return TimeStudy.remove(_id)
    }
  },
})