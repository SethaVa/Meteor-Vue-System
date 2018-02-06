import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UserGroups = new Mongo.Collection('userGroups');

UserGroups.schema = new SimpleSchema({
    name: {
        type: String,
        max: 200
    },
    roles: {
        type: Array
    },
    'roles.$': {
        type: String
    }
});

UserGroups.attachSchema(UserGroups.schema);

export default UserGroups;
