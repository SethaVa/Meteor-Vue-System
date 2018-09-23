import {Meteor} from 'meteor/meteor';
import room from '../room';

Meteor.publish('room', (selector = {}, options = {}) => {
    return room.find(selector, options);
});