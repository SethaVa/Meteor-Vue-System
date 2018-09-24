import { Meteor } from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import { Mongo } from 'meteor/mongo'

const RateSalary = new Mongo.Collection('sch_rateSalary')

RateSalary.schema = new SimpleSchema({
  _id:{
    type:String,
    optional:true
  },
  name: {
    type: String,
  },
  rate: {
    type: Number,
    defaultValue:0
  },
  amount:{
    type:Number,
    defaultValue:0
  }
})

RateSalary.attachSchema(RateSalary.schema)

export default RateSalary
