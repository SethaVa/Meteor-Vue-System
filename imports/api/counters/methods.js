import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import SimpleSchema from 'simpl-schema';

import Counters from './counters';

export const autoIncrement = new ValidatedMethod({
    name: 'autoIncrement',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        name: {
            type: String
        }
    }).validator(),
    run(name) {
        if (Meteor.isServer) {
            // Meteor._sleepForMs(500);

            let seq = 1;
            let counter = Counters.findOne({ _id: name });
            if (counter) {
                seq = counter.seq + 1;
                Counters.update({ _id: name }, { $set: { seq: seq } });
            } else {
                Counters.insert({ _id: name, seq: seq });
            }

            return seq;
        }
    }
});

export const getNextSequence = new ValidatedMethod({
    name: 'getNextSequence',
    mixins: [CallPromiseMixin],
    validate: new SimpleSchema({
        name: {
            type: String
        }
    }).validator(),
    async run({ name }) {
        if (Meteor.isServer) {
            try {
                const ret = await Counters.rawCollection().findOneAndUpdate(
                    { _id: name },
                    { $inc: { seq: 1 } },
                    { upsert: true, returnOriginal: false }
                );

                return ret.value.seq;
            } catch (error) {
                throw new Meteor.Error('NEXTSEQ', 'Failed to get next sequence number');
            }
        }
    }
});
