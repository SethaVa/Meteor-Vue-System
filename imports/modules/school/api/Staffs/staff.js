import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Staff = new Mongo.Collection('sch_staff');

Staff.schema = new SimpleSchema({
    name:{
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
        type:String,
        optional:true
    },
    tel:{
        type:String
    },
    positionId:{
        type:Array
    },
    'positionId.$':{
        type:String
    }
});

Staff.attachSchema(Staff.schema);

export default Staff;