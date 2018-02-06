import {Meteor} from 'meteor/meteor';
import Branches from '../branches.js';

Meteor.publish('core.branches', (selector = {}, options = {}) => {
    return Branches.find(selector, options);
});
