import AutoId from '/imports/util/auto-id';
import Type from '../type';

Type.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Type, {
        length: 2
    })
})