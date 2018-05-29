import { Meteor } from 'meteor/meteor'

// User
Meteor.publish('app.users', (selector = {}, options = {}) => {
  return Meteor.users.find(selector, options)
})

// Roles
Meteor.publish(null, function() {
  return Meteor.roles.find({})
})
