import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Position = new Mongo.Collection('position');

Position.schema = new SimpleSchema({
    position:{
        type:String
    },
    des:{
        type:String,
        optional:true
    },
    status:{
        type:String,
        optional:true
    }
});

Position.attachSchema(Position.schema);

export default Position;