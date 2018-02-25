import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const ClassStudy = new Mongo.Collection('classStudy')
ClassStudy.schema = new SimpleSchema({
  code: {
    type: String,
  },
  roomId: {
    type: String,
  },
  timeId: {
    type: String,
  },
  classDate: {
    type: Date,
  },
  status: {
    type: String,
  },
})

ClassStudy.attachSchema(ClassStudy.schema)

export default ClassStudy
