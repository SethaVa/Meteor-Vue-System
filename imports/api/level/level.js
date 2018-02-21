import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const leveleStudy = new Mongo.Collection('leveleStudy')

leveleStudy.schema = new SimpleSchema({
  leveleStudy: {
    type: String,
  },
  des: {
    type: String,
    optional: true,
  },
})

leveleStudy.attachSchema(leveleStudy.schema)
export default leveleStudy
