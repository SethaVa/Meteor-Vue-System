import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import { RestMethodMixin } from 'meteor/simple:rest-method-mixin';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';
import moment from 'moment';

import AppLogs from './app-logs';

// Insert
export const appLog = new ValidatedMethod({
    name: 'appLog',
    mixins: [CallPromiseMixin],
    validate: null,
    run(doc) {
        if (Meteor.isServer) {
            _.defaults(doc, {
                userId: Meteor.userId(),
                date: moment().toDate(),
            });

            return AppLogs.insert(doc);
        }
    }
});
