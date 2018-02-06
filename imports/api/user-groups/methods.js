import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';



import UserGroups from './user-groups';

// Datatable
export const userGroupList = new ValidatedMethod({
    name: 'userGroupList',
    mixins: [RestMethodMixin],
    validate: null,
    restOptions: {
        url: 'user-group-list',
        httpMethod: 'get',
        getArgsFromRequest: (req) => getArgsForDatatable(req)
    },
    run({ selector, options }) {
        if (!this.isSimulation) {
            // Meteor._sleepForMs(500);

            return {
                count: UserGroups.find(selector).count(),
                data: UserGroups.find(selector, options).fetch(),
            };
        }
    }
});

// Insert
export const insertUserGroup = new ValidatedMethod({
    name: 'insertUserGroup',
    mixins: [CallPromiseMixin],
    // validate: UserGroups.schema.validator(),
    validate: null,
    run(doc) {
        if (!this.isSimulation) {
            return UserGroups.insert(doc);
        }
    }
});

// Update
export const updateUserGroup = new ValidatedMethod({
    name: 'updateUserGroup',
    mixins: [CallPromiseMixin],
    // validate: UserGroups.schema.validator(),
    validate: null,
    run(doc) {
        if (!this.isSimulation) {
            return UserGroups.update({ _id: doc._id }, { $set: doc });
        }
    }
});

export const removeUserGroup = new ValidatedMethod({
    name: 'removeUserGroup',
    mixins: [CallPromiseMixin],
    // validate: null,
    validate: new SimpleSchema({
        _id: { type: String },
    }).validator(),
    run(selector) {
        if (!this.isSimulation) {
            return UserGroups.remove(selector);
        }
    }
});

// rateLimit({
//     methods: [
//         insertUserGroup,
//         updateUserGroup,
//         removeUserGroup,
//     ],
// });
