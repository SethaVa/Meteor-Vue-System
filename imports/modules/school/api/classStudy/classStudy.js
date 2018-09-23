import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const ClassStudy = new Mongo.Collection('classStudy')
ClassStudy.schema = new SimpleSchema({
  classDate: {
    type: Date,
  },
  roomId: {
    type: String,
  },
  timeId: {
    type: String,
  },
  staffId: {
    type: String,
  },
  subId: {
    type: String,
  },
  type: {
    type: String,
  },
  rateId: {
    type: String
  },
  status: {
    type: String,
  },
})

ClassStudy.attachSchema(ClassStudy.schema)

export default ClassStudy