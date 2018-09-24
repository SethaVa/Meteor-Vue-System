import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'
import _ from 'lodash'
import leveleStudy from './level'

export const findLeveleStudy = new ValidatedMethod({
  name: 'sch.findleveleStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = leveleStudy.find(selector, options).fetch()
      return data
    }
  },
})
//find for Options
export const findLevelStudyOpts = new ValidatedMethod({
  name: 'sch.findlevelStudyOpt',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector, options }) {
    if (Meteor.isServer) {
      selector = selector || {}
      options = options || {}
      let data = []
      let level = leveleStudy.find(selector, options).fetch()
      _.forEach(level, o => {
        data.push({
          label: o.leveleStudy,
          value: o._id,
        })
      })
      return data
    }
  },
})

export const findOneLeveleStudy = new ValidatedMethod({
  name: 'sch.findOneLeveleStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(id) {
    if (Meteor.isServer) {
      return leveleStudy.findOne({ _id: id })
    }
  },
})

export const insertLeveleStudy = new ValidatedMethod({
  name: 'sch.insertLeveleStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return leveleStudy.insert(doc)
    }
  },
})

export const updateLeveleStudy = new ValidatedMethod({
  name: 'sch.updateLeveleStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return leveleStudy.update({ _id: doc._id }, { $set: doc })
    }
  },
})

export const removeLevelStudy = new ValidatedMethod({
  name: 'sch.removeLeveleStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      console.log(_id)
      return leveleStudy.remove({ _id: _id })
    }
  },
})
