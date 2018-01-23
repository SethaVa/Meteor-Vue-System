import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';


import Teacher from './teacher';

// Find 
export const findTeacher = new ValidatedMethod({
    name: 'findTeacher',
    mixins: [CallPromiseMixin],
    validate: null,
    run({ selector, options }) {
        if (Meteor.isServer) {
            selector = selector || {};
            options = options || {};

            return Teacher.find(selector, options).fetch();
        }
    }
});

// Find One
export const findOneTeacher = new ValidatedMethod({
    name: 'findOneTeacher',
    mixins: [CallPromiseMixin],
    validate: null,
    run({ selector, options }) {
        if (Meteor.isServer) {
            selector = selector || {};
            options = options || {};

            return Teacher.findOne(selector, options);
        }
    }
});

// Insert 
export const insertTeacher = new ValidatedMethod({
    name: 'insertTeacher',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Teacher.insert(doc);
        }
    }
});

// Update
export const updateTeacher = new ValidatedMethod({
    name: 'updateTeacher',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Teacher.update({ _id: doc._id }, { $set: doc });
        }
    }
});

// Remove
export const removeTeacher = new ValidatedMethod({
    name: 'removeTeacher',
    mixins: [CallPromiseMixin],
    validate: null,
    run(selector) {
        if (Meteor.isServer) {
            return Teacher.remove(selector);
        }
    }
});