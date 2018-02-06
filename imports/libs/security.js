import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

export const notLoggedIn = () => {
    if (!Meteor.userId()) {
        // Throw errors with a specific error code
        throw new Meteor.Error('NotLoggedIn', 'Must be logged in');
    }
};

export const notHasRole = (role) => {
    if (!Roles.userIsInRole(Meteor.userId(), role)) {
        // Throw errors with a specific error code
        throw new Meteor.Error(403, 'Access denied');
    }
};

export const notLoggedInAndRole = (role) => {
    notLoggedIn();
    notHasRole(role);
};

export const insertError = () => {
    throw new Meteor.Error('Insert Error', 'Insert is error');
};

export const updateError = () => {
    throw new Meteor.Error('Update Error', 'Update is error');
};
