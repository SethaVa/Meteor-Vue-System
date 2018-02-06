import { Meteor } from 'meteor/meteor';
import UserGroups from '../user-groups.js';

Meteor.publish('userGroups', (selector = {}, options = {}) => {
    return UserGroups.find(selector, options);
});
