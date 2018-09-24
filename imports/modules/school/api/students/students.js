import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Students = new Mongo.Collection('sch_students')

Students.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  registerDate: {
    type: Date,
  },
  enName: {
    type: String,
  },
  khName: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: Date,
  },
  tel: {
    type: String,
    optional: true,
  },
  remove: {
    type: Boolean,
    optional: true,
  },
  type: {
    type: String,
  },
  branchId:{
    type:String
  }
})
Students.attachSchema(Students.schema)

export default Students
