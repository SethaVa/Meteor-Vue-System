import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Students = new Mongo.Collection('students')

Students.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
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
  },
  typeId: {
    type: String,
  },
})
Students.attachSchema(Students.schema)

export default Students
