import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Students = new Mongo.Collection('students')

Students.schema = new SimpleSchema({
  enName: {
    type: String,
  },
  khName: {
    type: String,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
  },
  tel: {
    type: String,
    optional: true,
  },

})
Students.attachSchema(Students.schema)

export default Students
