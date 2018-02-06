import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const AppLogs = new Mongo.Collection('appLogs');

// Schema
AppLogs.schema = new SimpleSchema({
    userId: {
        type: String
    },
    date: {
        type: Date
    },
    title: {
        type: String
    },
    level: {
        type: String
    },
    data: {
        type: Object,
        blackbox: true
    }
});

AppLogs.attachSchema(AppLogs.schema);

export default AppLogs;
