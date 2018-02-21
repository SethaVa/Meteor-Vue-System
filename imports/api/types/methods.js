import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';


import Type from './type';

// Find All Data
export const findType = new ValidatedMethod({
    name: 'findType',
    mixins: [CallPromiseMixin],
    validate: null,
    run( selector, option ) {
        if (Meteor.isServer) {
            selector = selector || {}
            option = option || {}

            return Type.find(selector, option).fetch();
        }
    }
});

// find One
export const findOneType= new ValidatedMethod({
    name:'findOneType',
    mixins:[CallPromiseMixin],
    validate:null,
    run({_id}){
        if(Meteor.isServer){
            return Type.findOne(_id);
        }
    }
});

// Insert
export const insertType = new ValidatedMethod({
    name: 'insertType',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            return Type.insert(doc)
        }
    }
});
// Update
export const updateType= new ValidatedMethod({
    name:'updateType',
    mixins:[CallPromiseMixin],
    validate:null,
    run(doc){
        if(Meteor.isServer){
            return Type.update({_id:doc._id},{$set:doc})
        }
    }
});

// Delete
export const removeType = new ValidatedMethod({
    name:'removeType',
    mixins:[CallPromiseMixin],
    validate: new SimpleSchema({
        id:{type:String}
    }).validator(),
    run({id}){
        if(Meteor.isServer){    
            return Type.remove({_id:id})
        }
    }
});