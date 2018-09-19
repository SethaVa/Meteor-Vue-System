import AutoId from '../../../lib/auto-id';
import Room from '../room';

Room.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Room, {
        length: 3
    })
})