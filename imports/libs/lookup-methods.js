import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin'

import _ from 'lodash'
import moment from 'moment'
import Type from '/imports/api/types/type'
import { findClassStudy } from '/imports/api/classStudy/methods'

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
  run({ selector }) {
    if (Meteor.isServer) {
      selector = selector || {}
      let list = []
      let classStudy = findClassStudy.run({ selector: selector })
      _.forEach(classStudy, o => {
        let timeStudy = o.timeStudy
          .map(o => {
            return moment(o).format('hh:mm a')
          })
          .join('-')
        list.push({
          value: o._id,
          label: o.roomName + ' : ' + o.teacher,
          labelRight: timeStudy,
        })
      })

      return list
    }
  },
})