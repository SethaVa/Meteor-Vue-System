import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const Items = new Mongo.Collection('sch_items')
Items.schema = new SimpleSchema({
  name: {
    type: String,
  },
  categoryId: {
    type: String
  },
  status: {
    type: String
  }

})

Items.attachSchema(Items.schema)

export default Items