import {Meteor} from 'meteor/meteor';
import Books from '../book';

Meteor.publish('Books', (selector = {}, options = {}) => {
    return Books.find(selector, options);
});