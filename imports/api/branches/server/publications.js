import { Meteor } from 'meteor/meteor'
import Branches from '../branches.js'

Meteor.publish('branches', (selector = {}, options = {}) => {
  return Branches.find(selector, options)
})
