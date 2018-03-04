import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import moment from 'moment'
import TimeStudy from './times'

export const findTimeStudy = new ValidatedMethod({
  name: 'findTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return TimeStudy.find(selector).fetch()
    }
  },
})
//find for Options
export const findTimeStudyOpts = new ValidatedMethod({
  name: 'findTimeStudyOpts',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let data = []
      let timeStudy = TimeStudy.find(selector).fetch()
      // let data = val
      //   .map(o => {
      //     return moment(o).format('hh:mm a')
      //   })
      //   .join('-')
      _.forEach(timeStudy, o => {
        let value = o
          .map(o => {
            return moment(o).format('hh:mm a')
          })
          .join('-')
        data.push({
          label: o._id,
          value: value,
        })
      })

      return data
    }
  },
})

export const findOneTimeStudy = new ValidatedMethod({
  name: 'findOneTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      return TimeStudy.findOne({ _id: id })
    }
  },
})

export const insertTimeStudy = new ValidatedMethod({
  name: 'insertTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return TimeStudy.insert(doc)
    }
  },
})

export const updateTimeStudy = new ValidatedMethod({
  name: 'updateTimeStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return TimeStudy.update({ _id: doc._id }, { $set: doc })
    }
  },
})

export const removeTimeStudy = new ValidatedMethod({
  name: 'removeTimeStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return TimeStudy.remove(_id)
    }
  },
})
