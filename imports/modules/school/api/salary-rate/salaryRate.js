import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const SalaryRate = new Mongo.Collection('sch_salaryRate')
SalaryRate.schema = new SimpleSchema({
  base: {
    type: String,
    max: 100,
  },
  exDate: {
    type: Date,
  },
  partTime: {
    type: Number,
  },
  fullTime: {
    type: Number,
  },
})

SalaryRate.attachSchema(SalaryRate.schema)

export default SalaryRate
