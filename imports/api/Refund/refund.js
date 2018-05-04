import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'
import { SIGTTIN } from 'constants'

const Refund = new Mongo.Collection('refund')
Refund.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  tranDate: {
    type: Date,
  },
  payId: {
    type: String,
  },
  classId: {
    type: String,
  },
  studentId: {
    type: String,
  },
  discountVal: {
    type: Number,
  },
  usd: {
    type: Number,
  },
  khr: {
    type: Number,
  },
  type: {
    type: String,
  },
})

Refund.attachSchema(Refund.schema)

export default Refund
