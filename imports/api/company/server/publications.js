import { Meteor } from 'meteor/meteor'
import Company from '../company'

Meteor.publish('company', () => {
  return Company.find()
})
