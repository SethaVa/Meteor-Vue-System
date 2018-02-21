import {Meteor} from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Mongo } from 'meteor/mongo';

const TimeStudy = new Mongo.Collection('timeStudy');
TimeStudy.schema = new SimpleSchema({
    timeStudy:{
        type:Date
    },
    des:{
        type:String,
        optional:true
    }
})

TimeStudy.attachSchema(TimeStudy.schema);

export default TimeStudy;