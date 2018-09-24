import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const ExchangeClass = new Mongo.Collection('sch_exchangeClass')
ExchangeClass.schema = new SimpleSchema({
  tranDate: {
    type: Date
  },
  classFromId: {
    type: String
  },
  classToId: {
    type: String
  },
  studentId: {
    type: String
  }
})

ExchangeClass.attachSchema(ExchangeClass.schema)

export default ExchangeClass