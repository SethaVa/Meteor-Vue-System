import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const IncomeDetails = new Mongo.Collection('sch_incomeDetails')
IncomeDetails.schema = new SimpleSchema({
  tranDate: {
    type: Date,
  },
  name: {
    type: String,
  },
  qty: {
    type: Number,
  },
  referenceType: {
    type: String,
  },
  referenceId: {
    type: String,
  },
  usd: {
    type: Number,
    defaultValue: 0,
  },
  khr: {
    type: Number,
    defaultValue: 0,
  },
})

IncomeDetails.attachSchema(IncomeDetails.schema)

export default IncomeDetails
