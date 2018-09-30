import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const ClassStudy = new Mongo.Collection('sch_classStudy')
ClassStudy.schema = new SimpleSchema({
  _id:{
    type:String,
    optional:true
  },
  code:{
    type:String,
    required:true
  },
  classDate: {
    type: Date,
    required:true
  },
  roomId: {
    type: String,
    required:true
  },
  timeId: {
    type: String,
    required:true
  },
  staffId: {
    type: String,
    required:true
  },
  subId: {
    type: String,
    required:true
  },
  type: {
    type: String,
    required:true
  },
  rateId: {
    type: String,
    required:true
  },
  status: {
    type: String,
    required:true
  },
  branchId:{
    type:String,
    required:true
  }
})

ClassStudy.attachSchema(ClassStudy.schema)

export default ClassStudy