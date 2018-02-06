import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Subjects = new Mongo.Collection('subjects');

Subjects.schema = new SimpleSchema({
    code:{
        type:String,
    },
    title:{
        type:String,
    },
    typeId:{
        type:String,
        optional:true
    },
    level:{
        type:String,
        optional:true
    },
    status:{
        type:String,
        optional:true
    }
});

Subjects.attachSchema(Subjects.schema);

export default Subjects;