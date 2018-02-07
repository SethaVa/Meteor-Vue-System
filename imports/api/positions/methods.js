import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';


import Position from './position';

// Find All Data
export const findPosition = new ValidatedMethod({
    name: 'findPosition',
    mixins: [CallPromiseMixin],
    validate: null,
    run( {selector, option} ) {
        if (Meteor.isServer) {
            selector = selector || {}
            option = option || {}

            return Position.find(selector, option).fetch();
        }
    }
});

// find One
export const findOnePosition= new ValidatedMethod({
    name:'findOnePosition',
    mixins:[CallPromiseMixin],
    validate:null,
    run({_id}){
        if(Meteor.isServer){
            return Position.findOne(_id);
        }
    }
});

// Insert
export const insertPosition = new ValidatedMethod({
    name: 'insertPosition',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Position.insert(doc)
        }
    }
});
// Update
export const updatePosition= new ValidatedMethod({
    name:'updatePosition',
    mixins:[CallPromiseMixin],
    validate:null,
    run(doc){
        if(Meteor.isServer){
            return Position.update({_id:doc._id},{$set:doc})
        }
    }
});

// Delete
export const removePosition = new ValidatedMethod({
    name:'removePosition',
    mixins:[CallPromiseMixin],
    validate: new SimpleSchema({
        _id:{type:String}
    }).validator(),
    run({_id}){
        if(Meteor.isServer){    
            return Position.remove(_id)
        }
    }
});

