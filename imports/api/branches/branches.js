import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Branches = new Mongo.Collection('branches');

Branches.schema = new SimpleSchema({
    name: {
        type: String,
        max: 200
    },
    shortName: {
        type: String,
        max: 200
    },
    address: {
        type: String,
    },
    telephone: {
        type: String,
        max: 100,
        optional: true
    },
    email: {
        type: String,
        regEx: SimpleSchema.RegEx.Email,
        optional: true
    }
});

Branches.attachSchema(Branches.schema);

export default Branches;
