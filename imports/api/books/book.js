import {Mongo} from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Books = new Mongo.Collection('books');

Books.schema = new SimpleSchema({
    code:{
        type:String,
    },
    title:{
        type:String,
    },
    bookType:{
        type:String,
        required:true
    },
});

Books.attachSchema(Books.schema);

export default Books;