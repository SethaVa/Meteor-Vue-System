import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';

import TimeStudy from './times';

export const findTimeStudy = new ValidatedMethod({
    name:'findTimeStudy',
    minixs:[CallPromiseMixin],
    validate:null,
    run({selector}){
        if(Meteor.isServer){
            selector = selector || {};
            return TimeStudy.find(selector).fetch();
        }
    }
});

export const findOneTimeStudy = new ValidatedMethod({
    name:'findOneTimeStudy',
    minixs:[CallPromiseMixin],
    validate:null,
    run({id}){
        if(Meteor.isServer){
            return TimeStudy.findOne({_id:id});
        }
    }
});

export const updateTimeStudy = new ValidatedMethod({
    name:'updateTimeStudy',
    minixs:[CallPromiseMixin],
    validate: null,
    run(doc){
        if(Meteor.isServer){
            return TimeStudy.update({_id:doc._id},{$set:doc});
        }
    }

});


export const removeTimeStudy = new ValidatedMethod({
    name:'removeTimeStudy',
    minixs:[CallPromiseMixin],
    validate:new SimpleSchema({
        _id :{type:String}
    }).validator(),
    run({_id}){
        if(Meteor.isServer){
            return TimeStudy.remove(_id);
        }
    }
});