import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const Refund = new Mongo.Collection('sch_refund')
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
  amount: {
    type: Number,
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
  remaining: {
    type: Number,
  },
  type: {
    type: String,
  },
})

Refund.attachSchema(Refund.schema)

export default Refund
