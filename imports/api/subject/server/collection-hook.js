import AutoId from '../../../lib/auto-id';
import Subject from '../subjects';

// import AutoId from '/imports/lib/auto-id';
// // Collection
// import Subject from '../payment-term';

Subject.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Subject, {
        length:3
    });
});