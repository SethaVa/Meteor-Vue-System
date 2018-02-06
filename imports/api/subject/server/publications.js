import {Meteor} from 'meteor/meteor';
import Subject from '../subjects';

Meteor.publish('Subject', (selector = {}, options = {}) => {
    return Subject.find(selector, options);
});