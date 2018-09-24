import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const TimeStudy = new Mongo.Collection('sch_timeStudy')
TimeStudy.schema = new SimpleSchema({
  timeStudy: {
    type: Array,
  },
  'timeStudy.$': {
    type: Date,
  },
})

TimeStudy.attachSchema(TimeStudy.schema)

export default TimeStudy
