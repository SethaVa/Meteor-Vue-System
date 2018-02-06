import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';

import UserGroups from '../user-groups/user-groups';

// Schema
let validateSchema = new SimpleSchema({
    username: {
        type: String,
        min: 3
    },
    email: {
        type: String
    },
    password: {
        type: String,
        min: 6
    },
    profile: {
        type: Object
    },
    'profile.fullName': {
        type: String
    },
    'profile.branchPermissions': {
        type: Array
    },
    'profile.branchPermissions.$': {
        type: String
    },
    'profile.roleGroup': {
        type: String
    },
    roles: {
        type: Array
    },
    'roles.$': {
        type: String
    },
});

// Datatable
// export const userList = new ValidatedMethod({
//     name: 'userList',
//     mixins: [RestMethodMixin],
//     validate: null,
//     restOptions: {
//         url: 'user-list',
//         httpMethod: 'get',
//         getArgsFromRequest: (req) => getArgsForDatatable(req)
//     },
//     run({ selector, options }) {
//         if (!this.isSimulation) {
//             // Meteor._sleepForMs(500);

//             return {
//                 count: Meteor.users.find(selector).count(),
//                 data: Meteor.users.find(selector, options).fetch(),
//             };
//         }
//     }
// });

// Find current user
export const currentUser = new ValidatedMethod({
    name: 'currentUser',
    mixins: [CallPromiseMixin],
    validate: null,
    run() {
        if (Meteor.isServer) {
            // Meteor._sleepForMs(500);
            return Meteor.user();
        }
    }
});


// Find
export const findOneUser = new ValidatedMethod({
    name: 'findOneUser',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        _id: { type: String }
    }).validator(),
    run({ _id }) {
        if (Meteor.isServer) {
            // Meteor._sleepForMs(500);
            return Meteor.users.findOne(_id);
        }
    }
});


// Insert
export const insertUser = new ValidatedMethod({
    name: 'insertUser',
    mixins: [CallPromiseMixin],
    // validate: Users.schema.validator(),
    validate: null,
    run(doc) {
        if (!this.isSimulation) {
            // Check role
            if (Roles.userIsInRole(Meteor.userId(), 'userInsert')) {
                const user = {
                    username: doc.username,
                    email: doc.email,
                    password: doc.password,
                    profile: {
                        fullName: doc.fullName,
                        branchPermissions: doc.branchPermissions,
                        roleGroup: doc.roleGroup,
                    },
                };

                const userId = Accounts.createUser(user);
                Roles.addUsersToRoles(userId, doc.roles);

                return userId;
            }

            throw new Meteor.Error(403, "Access denied")
        }
    }
});

// Update
export const updateUser = new ValidatedMethod({
    name: 'updateUser',
    mixins: [CallPromiseMixin],
    // validate: Users.schema.validator(),
    validate: null,
    run(doc) {
        if (!this.isSimulation) {
            // Check role
            if (Roles.userIsInRole(Meteor.userId(), 'userUpdate')) {
                let modifier = {
                    username: doc.username,
                    'emails.0.address': doc.email,
                    profile: {
                        fullName: doc.fullName,
                        branchPermissions: doc.branchPermissions,
                        roleGroup: doc.roleGroup,
                    },
                };

                // Update user
                Meteor.users.update({ _id: doc._id }, { $set: modifier });

                // Update password
                Accounts.setPassword(doc._id, doc.password);

                // Update roles
                Roles.setUserRoles(doc._id, doc.roles);

                return 'success';
            }

            throw new Meteor.Error(403, "Access denied")
        }
    }
});

export const removeUser = new ValidatedMethod({
    name: 'removeUser',
    mixins: [CallPromiseMixin],
    // validate: null,
    validate: new SimpleSchema({
        _id: { type: String },
    }).validator(),
    run(selector) {
        if (!this.isSimulation) {
            // return Users.remove(selector);
        }
    }
});

// Check unique username/email
export const uniqueUser = new ValidatedMethod({
    name: 'uniqueUser',
    mixins: [CallPromiseMixin],
    validate: null,
    // validate: new SimpleSchema({
    //     _id: {type: String},
    // }).validator(),
    run(selector) {
        if (!this.isSimulation) {
            let count = Meteor.users.find(selector).count();
            if (count > 0) {
                throw new Meteor.Error('Unique', 'Must be unique');
            }

            return 'not unique';
        }
    }
});

// Update profile
export const updateUserProfile = new ValidatedMethod({
    name: 'updateUserProfile',
    mixins: [CallPromiseMixin],
    // validate: Users.schema.validator(),
    validate: null,
    run(doc) {
        if (!this.isSimulation) {
            let modifier = {
                username: doc.username,
                'emails.0.address': doc.email,
                'profile.fullName': doc.fullName,
            };

            // Update user
            Meteor.users.update({ _id: doc._id }, { $set: modifier });

            return 'success';
        }

    }
});

// Check user password
export const checkUserPassword = new ValidatedMethod({
    name: 'checkUserPassword',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        password: { type: String }
    }).validator(),
    run({ password }) {
        if (!this.isSimulation) {
            console.log(password);

            let digest = Package.sha.SHA256(password);

            let user = Meteor.user();
            let passwordOpts = { digest: digest, algorithm: 'sha-256' };
            let result = Accounts._checkPassword(user, passwordOpts);

            return result;
        }
    }
});

// Update user password
export const updateUserPassword = new ValidatedMethod({
    name: 'updateUserPassword',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        password: { type: String }
    }).validator(),
    run({ password }) {
        if (!this.isSimulation) {
            console.log(password);

            let digest = Package.sha.SHA256(password);

            let user = Meteor.user();
            let passwordOpts = { digest: digest, algorithm: 'sha-256' };
            let result = Accounts._checkPassword(user, passwordOpts);

            return result;
        }
    }
});

// Check user is in role
export const userIsInRole = new ValidatedMethod({
    name: 'userIsInRole',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        role: { type: String },
    }).validator(),
    run({ role }) {
        if (!this.isSimulation) {
            if (Roles.userIsInRole(Meteor.userId(), role)) {
                return true;
            }
            throw new Meteor.Error(403, "Access denied")
        }
    }
});

// rateLimit({
//     methods: [
//         insertUser,
//         updateUser,
//         removeUser,
//         userIsInRole
//     ],
// });
