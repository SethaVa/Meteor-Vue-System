import AutoId from '../../../lib/auto-id';
import Type from '../type';

Type.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Type, {
        length: 2
    })
})