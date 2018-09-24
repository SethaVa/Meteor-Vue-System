import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const Stock = new Mongo.Collection('sch_stocks')
Stock.schema = new SimpleSchema({
  date: {
    type: String,
  },
  subTotal: {
    type: String
  },
  // status: {
  //   type: String
  // }

})

Stock.attachSchema(Stock.schema)

export default Stock