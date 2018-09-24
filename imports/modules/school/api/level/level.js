import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const leveleStudy = new Mongo.Collection('sch_level')

leveleStudy.schema = new SimpleSchema({
  level: {
    type: String,
  },
  // des: {
  //   type: String,
  //   optional: true,
  // },
})

leveleStudy.attachSchema(leveleStudy.schema)
export default leveleStudy
