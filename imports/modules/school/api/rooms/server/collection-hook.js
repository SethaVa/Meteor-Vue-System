import AutoId from '/imports/util/auto-id';
import Room from '../room';

Room.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Room, {
        length: 3
    })
})