import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Type = new Mongo.Collection('types')

Type.schema = new SimpleSchema({
  type: {
    type: String,
  },
  des: {
    type: String,
    optional: true,
  },
  status: {
    type: String,
  },
})

Type.attachSchema(Type.schema)
export default Type
