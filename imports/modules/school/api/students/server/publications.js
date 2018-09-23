import {Meteor} from 'meteor/meteor';
import students from '../students';

Meteor.publish('student', (selector = {}, options = {}) => {
    return students.find(selector, options);
});