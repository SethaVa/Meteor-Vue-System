import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';


import Books from './book';

// Find 
export const findBook = new ValidatedMethod({
    name: 'findBook',
    mixins: [CallPromiseMixin],
    validate: null,
    run({ selector, options }) {
        if (Meteor.isServer) {
            selector = selector || {};
            options = options || {};

            return Books.find(selector, options).fetch();
        }
    }
});

// Find One
export const findOneBook = new ValidatedMethod({
    name: 'findOneBook',
    mixins: [CallPromiseMixin],
    validate: null,
    run({ selector, options }) {
        if (Meteor.isServer) {
            selector = selector || {};
            options = options || {};

            return Books.findOne(selector, options);
        }
    }
});

// Insert 
export const insertBook = new ValidatedMethod({
    name: 'insertBook',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Books.insert(doc);
        }
    }
});

// Update
export const updateBook = new ValidatedMethod({
    name: 'updateBook',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Books.update({ _id: doc._id }, { $set: doc });
        }
    }
});

// Remove
export const removeBook = new ValidatedMethod({
    name: 'removeBook',
    mixins: [CallPromiseMixin],
    validate: null,
    run(selector) {
        if (Meteor.isServer) {
            return Books.remove(selector);
        }
    }
});