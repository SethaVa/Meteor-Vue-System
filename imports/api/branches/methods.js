import {
    Meteor
} from 'meteor/meteor';
import {
    ValidatedMethod
} from 'meteor/mdg:validated-method';
import {
    CallPromiseMixin
} from 'meteor/didericis:callpromise-mixin';
import {
    RestMethodMixin
} from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';

import {
    userIsInRole,
    throwError
} from '../../lib/security'

import Branches from './branches';


// Find
export const findBranches = new ValidatedMethod({
    name: 'core.findBranches',
    mixins: [CallPromiseMixin],
    validate: null,
    run(selector, options) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);
            selector = selector || {};
            options = options || {};

            return Branches.find(selector, options).fetch();
        }
    }
});

// Find One
export const findOneBranch = new ValidatedMethod({
    name: 'core.findOneBranch',
    mixins: [CallPromiseMixin],
    validate: null,
    run(selector, options) {
        if (!this.isSimulation) {
            Meteor._sleepForMs(200);
            selector = selector || {};
            options = options || {};

            return Branches.findOne(selector, options);
        }
    }
});

// Insert
export const insertBranch = new ValidatedMethod({
    name: 'core.insertBranch',
    mixins: [CallPromiseMixin],
    // validate: Branches.schema.validator(),
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            userIsInRole(['super'])
            return Branches.insert(doc);
        }
    }
});

// Update
export const updateBranch = new ValidatedMethod({
    name: 'core.updateBranch',
    mixins: [CallPromiseMixin],
    // validate: Branches.schema.validator(),
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            userIsInRole(['super', 'admin'])
            return Branches.update({
                _id: doc._id
            }, {
                $set: doc
            })
            // return Branches.update({
            //     _id: doc._id
            // }, {
            //     $set: doc
            // });
        }
    }
});

export const removeBranch = new ValidatedMethod({
    name: 'core.removeBranch',
    mixins: [CallPromiseMixin],
    // validate: null,
    validate: new SimpleSchema({
        _id: {
            type: String
        },
    }).validator(),
    run(selector) {
        if (!this.isSimulation) {
            return Branches.remove(selector);
        }
    }
});

// rateLimit({
//     methods: [
//         findBranches,
//         findOneBranch,
//         insertBranch,
//         updateBranch,
//         removeBranch,
//     ],
// });