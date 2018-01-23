import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Rooms = new Mongo.Collection('rooms');

Rooms.schema = new SimpleSchema({
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

Rooms.attachSchema(Rooms.schema);

export default Rooms;