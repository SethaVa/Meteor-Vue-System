import { Mongo } from 'meteor/mongo'
import SimpleSchema from 'simpl-schema'

const Company = new Mongo.Collection('app_company')

Company.settingSchema = new SimpleSchema({
  baseCurrency: {
    type: String,
  },
  decimalNumber: {
    type: Number,
  },
  interface:{
    type:String
  },
  dateFormat: {
    type: String,
  },
  lang: {
    type: String,
  },
})

Company.schema = new SimpleSchema({
  name: {
    type: String,
    max: 500,
  },
  address: {
    type: String,
  },
  telephone: {
    type: String,
    max: 100,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  // Type of company: chart of account fixture
  industry: {
    type: String,
  },
  setting: Company.settingSchema,
})

Company.attachSchema(Company.schema)

export default Company
