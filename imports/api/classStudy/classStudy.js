import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const ClassStudy = new Mongo.Collection('classStudy')
ClassStudy.schema = new SimpleSchema({
  // code: {
  //   type: String,
  // },
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
    optional: true,
  },
  subId: {
    type: String,
    optional: true,
  },
  typeId: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
  },
})

ClassStudy.attachSchema(ClassStudy.schema)

export default ClassStudy
