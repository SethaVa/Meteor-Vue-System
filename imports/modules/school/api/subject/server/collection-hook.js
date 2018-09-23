import AutoId from '/imports/util/auto-id';
import Subject from '../subjects';

// import AutoId from '/imports/util/auto-id';
// // Collection
// import Subject from '../payment-term';

Subject.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Subject, {
        length:3
    });
});