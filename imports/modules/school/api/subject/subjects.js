import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Subjects = new Mongo.Collection('subjects')

Subjects.schema = new SimpleSchema({
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  level: {
    type: String,
  },
  status: {
    type: String,
    optional: true,
  },
})

Subjects.attachSchema(Subjects.schema)

export default Subjects
