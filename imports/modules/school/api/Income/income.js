import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const Income = new Mongo.Collection('sch_income')
Income.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  tranDate: {
    type: Date,
  },
  // New ,Pay,Refund,Income,Expend
  referenceType: {
    type: String,
  },
  // From Register,Pay,Refund,Income,Expend
  referenceId: {
    type: String,
    optional: true,
  },
  totalUsd: {
    type: Number,
    defaultValue: 0,
  },
  totalKhr: {
    type: Number,
    defaultValue: 0,
  },
})

Income.attachSchema(Income.schema)

export default Income
