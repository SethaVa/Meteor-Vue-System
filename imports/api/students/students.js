import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Students = new Mongo.Collection('students');

Students.schema = new SimpleSchema({
    name: {
        type: Object
    },
    'name.first': {
        type: String,
        required: true
    },
    'name.last': {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    tel: {
        type: String,
        required: true
    }
});

Students.attachSchema(Students.schema);

export default Students;