import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Register = new Mongo.Collection('sch_register')

Register.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  tranDate: {
    type: Date,
  },
  classId: {
    type: String,
  },
  studentId: {
    type: String,
    optional: true,
  },
})

Register.attachSchema(Register.schema)

export default Register
