import {
  Meteor
} from 'meteor/meteor'
import SimpleSchema from 'simpl-schema'
import {
  Mongo
} from 'meteor/mongo'

const Categories = new Mongo.Collection('sch_categories')
Categories.schema = new SimpleSchema({
  name: {
    type: String,
  },

})

Categories.attachSchema(Categories.schema)

export default Categories