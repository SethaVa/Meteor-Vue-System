import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const Income = new Mongo.Collection('income')
Income.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  tranDate: {
    type: Date,
  },
  referenceType: {
    type: String,
  },
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
