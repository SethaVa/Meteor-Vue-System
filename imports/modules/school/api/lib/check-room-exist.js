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
import ClassStudy from '../class-study/class-study'


export const checkClassExist = new ValidatedMethod({
  name: 'sch.checkClassExist',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    selector:{
      type:Object,
      blackbox:true,
    }
  }).validator(),
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}

      return ClassStudy.findOne(selector)
      // return ClassStudy.find(selector).fetch()
      // return aggregateFindClassStudy(selector)
    }
  },
})