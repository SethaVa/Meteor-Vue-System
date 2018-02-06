import {Meteor} from 'meteor/meteor';
import Type from '../type';

Meteor.publish('Type', (selector = {}, options = {}) => {
    return Type.find(selector, options);
});