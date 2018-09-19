import AutoId from '../../../lib/auto-id';
import Position from '../position';

Position.before.insert(function (userId, doc) {
    doc._id = AutoId.make(Position, {
        length: 2
    })
})