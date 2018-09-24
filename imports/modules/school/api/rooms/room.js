import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Rooms = new Mongo.Collection('sch_rooms');

Rooms.schema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    name: {
        type: String
    },
    des: {
        type: String,
        optional: true
    },
    // status:{
    //     type:String
    // }
});

Rooms.attachSchema(Rooms.schema);

export default Rooms;