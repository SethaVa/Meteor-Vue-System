import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';

import Counters from '../counters';

Meteor.publish('counters', () => {
    // Meteor._sleepForMs(100);
    return Counters.find();
});
