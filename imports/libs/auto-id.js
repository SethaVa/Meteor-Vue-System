import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';

import Counters from '../api/counters/counters';

const AutoId = {
    make: function (collection, opts = {}) {
        _.defaults(opts, {
            // length: 2,
            field: '_id',
            selector: {}
        });

        let newId = _.padStart(1, opts.length, '0');
        let sort = { [opts.field]: -1 };

        let obj = collection.findOne(opts.selector, { sort: sort });
        if (obj != null) {
            let tmpId = parseInt(obj[opts.field]) + 1;
            // Check length
            if (tmpId.toString().length > opts.length) {
                newId = null;
            } else {
                newId = _.padStart(tmpId, opts.length, '0');
            }
        }

        return newId;
    },
    makeWithPrefix: function (collection, opts = {}) {
        _.defaults(opts, {
            // prefix: '001',
            // length: 2,
            field: '_id',
            selector: {}
        });

        let newId = opts.prefix + _.padStart(1, opts.length, '0');
        let selector = opts.selector;
        selector[opts.field] = new RegExp('^' + opts.prefix, 'm');

        let sort = { [opts.field]: -1 };

        let obj = collection.findOne(selector, { sort: sort });
        if (obj != null) {
            let currentId = (obj[opts.field]).slice(-opts.length);
            let tmpId = parseInt(currentId) + 1;

            // Check length
            if (tmpId.toString().length > opts.length) {
                newId = null;
            } else {
                tmpId = _.padStart(tmpId, opts.length, '0');
                newId = opts.prefix + tmpId;
            }
        }

        return newId;
    },
    increment: function (name) {
        check(name, String);
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
};

export default AutoId;
