import {Meteor} from 'meteor/meteor';
import Teacher from '../teacher';

Meteor.publish('Teacher', (selector = {}, options = {}) => {
    return Teacher.find(selector, options);
});