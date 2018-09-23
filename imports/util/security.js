import { Meteor } from 'meteor/meteor'
import { Roles } from 'meteor/alanning:roles'

export const userLoggedIn = () => {
  if (Meteor.userId()) {
    return true
  }
  throw new Meteor.Error('logged-out', 'The user is not login')
}


export const userIsInRole = roles => {
  const userId = Meteor.userId()
  if (userId && Roles.userIsInRole(userId, roles)) {
    return true
  }
  console.log('User is not in roles')
  throw new Meteor.Error(403, 'Access denied')
}

export const throwError = e => {
  console.log('Throw Error', e)
  throw new Meteor.Error('transaction-error', 'Transaction Error', e)
}

