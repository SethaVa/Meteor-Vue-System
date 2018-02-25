import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const ClassDetails = new Mongo.Collection('classDetails')
ClassDetails.schema = new SimpleSchema({
  referenceId: {
    type: String,
  },
  teacherId: {
    type: String,
  },
  subId: {
    type: String,
  },
})

ClassDetails.attachSchema(ClassDetails.schema)

export default ClassDetails
