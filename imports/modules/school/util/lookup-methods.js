import {
  Meteor
} from 'meteor/meteor'
import {
  ValidatedMethod
} from 'meteor/mdg:validated-method'
import {
  CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin'

import _ from 'lodash'
import moment from 'moment'
import Type from '/imports/modules/school/api/types/methods'
import {
  findClassStudy
} from '/imports/modules/school/api/class-study/methods'
import Students from '../api/students/students'
import Categories from '../api/categories/categories'

import {
  findPaymentForClass,
} from '/imports/modules/school/api/payment/methods'
import {
  SimpleSchema
} from 'simpl-schema/dist/SimpleSchema';


export const lookupType = new ValidatedMethod({
  name: 'lookupType',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      let list = []
      let type = Type.find({}).fetch()
      _.forEach(type, o => {
        list.push({
          value: o._id,
          label: o._id + ' : ' + o.type,
        })
      })
      return list
    }
  },
})

export const lookupClass = new ValidatedMethod({
  name: 'lookupClass',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let list = []
      let classStudy = findClassStudy.run({
        selector: selector
      })
      _.forEach(classStudy, o => {
        let timeStudy = _.map(o => {
            return moment(o).format('LT')
          })
          .join('-')
        list.push({
          value: o._id,
          label: o.subject,
          labelRight: timeStudy,
        })
      })

      return list
    }
  },
})

export const lookupCategories = new ValidatedMethod({
  name: 'lookupCategories',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let list = []
      let categories = Categories.find(selector).fetch()
      _.forEach(categories, o => {
        list.push({
          value: o._id,
          label: o.name,
        })
      })

      return list
    }
  },
})

export const lookupStudent = new ValidatedMethod({
  name: 'lookupStudent',
  mixins: [CallPromiseMixin],
  validate: null,
  run({
    selector
  }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let list = []
      let type = Students.find(selector).fetch()
      _.forEach(type, o => {
        list.push({
          value: o._id,
          label: o._id + ' : ' + o.enName,
        })
      })
      return list
    }
  },
})

export const lookupStudentForExpire = new ValidatedMethod({
  name: 'lookupStudentForExpire',
  mixins: [CallPromiseMixin],
  validate: null,
  run() {
    if (Meteor.isServer) {
      let list = []
      let selector = {
        // classId: this.form.classId,
        status: {
          $in: ['Expires', '$classDetail']
        },
      }

      findPaymentForClass
        .callPromise({
          selector: selector
        })
        .then(result => {
          if (result.length > 0) {
            _.forEach(result[0].classDetail, o => {
              list.push({
                value: o.studentId,
                label: o.studentId + ' - ' + o.student,
              })
            })

          }
        })
        .catch(error => {
          Notify.error({
            message: error.reason
          })
        })
      return list
    }
  },
})
