import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Employees = new Mongo.Collection('employees');

Employees.schema = new SimpleSchema({
    first:{
        type:String,
        required:true
    },
    last:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    dob:{
        type:String,
        required:true
    },
    email:{
        type:String
    },
    tel:{
        type:String
    },
});

Employees.attachSchema(Employees.schema);

export default Employees;