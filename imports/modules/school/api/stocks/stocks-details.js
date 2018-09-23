import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {Mongo} from 'meteor/mongo'

const StockDetails = new Mongo.Collection('stock-details')

StockDetails.schema = new SimpleSchema({
  type:{
    type:String
  },
  itemId: {
    type: String,
  },
  categoryId: {
    type: String
  },
})

StockDetails.attachSchema(StockDetails.schema)

export default StockDetails