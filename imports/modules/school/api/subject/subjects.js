import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Subjects = new Mongo.Collection('sch_subjects')

Subjects.schema = new SimpleSchema({
  title: {
    type: String,
  },
  type: {
    type: String,
  },
  levelId: {
    type: String,
  },
  status: {
    type: String,
  },
})

Subjects.attachSchema(Subjects.schema)

export default Subjects
