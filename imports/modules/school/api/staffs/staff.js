import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Staff = new Mongo.Collection('sch_staffs');

Staff.schema = new SimpleSchema({
    _id:{
        type:String,
        optional:true
    },
    name: {
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
    email: {
        type: String,
        optional: true
    },
    tel: {
        type: String
    },
    baseSalary: {
        type: Number,
        defaultValue: 0
    },
    positionId: {
        type: Array
    },
    'positionId.$': {
        type: String
    },
    branchId: {
        type: String
    }
});

Staff.attachSchema(Staff.schema);

export default Staff;