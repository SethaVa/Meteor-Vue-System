import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Students = new Mongo.Collection('students');

Students.schema = new SimpleSchema({
    name: {
        type: String
    },
    khName:{
        type:String,
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
    },
    studentType:{
        type:String
    }
});

Students.attachSchema(Students.schema);

export default Students;