import check from 'meteor/check';

import { appLog } from '../api/app-logs/methods';

export const log = {
    login(data) {
        check(data, Object);
        data.level = 'LOGIN';
        return appLog.run(data);
    },
    logout(data) {
        check(data, Object);
        data.level = 'LOGOUT';
        return appLog.run(data);
    },
    insert(data) {
        console.log('hi');

        check(data, Object);
        data.level = 'INSERT';
        return appLog.run(data);
    },
    update(data) {
        check(data, Object);
        data.level = 'UPDATE';
        return appLog.run(data);
    },
    remove(data) {
        check(data, Object);
        data.level = 'REMOVE';
        return appLog.run(data);
    },
    view(data) {
        check(data, Object);
        data.level = 'VIEW';
        return appLog.run(data);
    },
};

export const autoLog = (Collection, title) => {
    Collection.after.insert((userId, doc) => {
        log.insert({ title: title, data: doc });
    });

    Collection.after.update((userId, doc, fieldNames, modifier, options) => {
        modifier.$set = modifier.$set || {};
        log.update({ title: 'Post', data: modifier.$set });
    });

    Collection.after.remove((userId, doc) => {
        log.remove({ title: title, data: doc });
    });
};
