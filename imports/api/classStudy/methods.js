import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin'
import SimpleSchema from 'simpl-schema'

import ClassStudy from './classStudy'
import ClassDetails from '../classDetails/classDetails'
import classDetails from '../classDetails/classDetails'

export const findClassStudy = new ValidatedMethod({
  name: 'findClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      return ClassStudy.find(selector).fetch()
    }
  },
})

export const findOneClassStudy = new ValidatedMethod({
  name: 'findOneClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ id }) {
    if (Meteor.isServer) {
      return ClassStudy.findOne({ _id: id })
    }
  },
})

//insert
export const insertClassStudy = new ValidatedMethod({
  name: 'insertclassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run({ doc, clsDetails }) {
    if (Meteor.isServer) {
      let classStudyId
      try {
        ClassStudy.insert(doc, (error, result) => {
          if (!error) {
            classStudyId = result
            clsDetails.forEach(item => {
              item.referenceId = classStudyId
              item.teacherId = teacherId
              item.subId = subId
              ClassDetails.insert(item)
            })
          }
        })
        return classStudyId
      } catch (error) {
        ClassStudy.remove({ referenceId: classStudyId })
        ClassStudy.remove({ _id: classStudyId })

        throw new Meteor.Error('transaction-error', 'Transaction Error', error)
      }
    }
  },
})
export const updateClassStudy = new ValidatedMethod({
  name: 'updateClassStudy',
  mixins: [CallPromiseMixin],
  validate: null,
  run(doc) {
    if (Meteor.isServer) {
      return ClassStudy.update({ _id: doc._id }, { $set: doc })
    }
  },
})

export const removeClassStudy = new ValidatedMethod({
  name: 'removeClassStudy',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    if (Meteor.isServer) {
      return ClassStudy.remove(_id)
    }
  },
})
