import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Exchanges = new Mongo.Collection('exchanges')

// Schema
Exchanges.schema = new SimpleSchema({
  base: {
    type: String,
    max: 100,
  },
  exDate: {
    type: Date,
  },
  usd: {
    type: Number,
  },
  khr: {
    type: Number,
  },
  thb: {
    type: Number,
  },
})

Exchanges.attachSchema(Exchanges.schema)

export default Exchanges
