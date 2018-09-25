import {
    Mongo
} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Position = new Mongo.Collection('sch_position');

Position.schema = new SimpleSchema({
    _id: {
        type: String,
        optional: true
    },
    position: {
        type: String
    },
    des: {
        type: String,
        optional: true
    },
});

Position.attachSchema(Position.schema);

export default Position;