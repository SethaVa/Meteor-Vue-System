import { EJSON } from 'meteor/ejson';
import _ from 'lodash';
import moment from 'moment';

export default function (req) {
    let selector = EJSON.parse(req.query.selector);
    let query = EJSON.parse(req.query.query);
    let options = EJSON.parse(req.query.options);

    // Do query
    let _query = {};
    let conVal = null;
    switch (query && query.type) {
        case 'Number':
            _query[query.name] = parseFloat(query.value);
            break;
        case 'Date':
            _query[query.name] = {
                $gte: moment(query.value, 'DD/MM/YYYY').startOf('day').toDate(),
                $lte: moment(query.value, 'DD/MM/YYYY').endOf('day').toDate()
            };
            break;
        case 'Boolean':
            if (query.value == 'true' || query.value == 'false') {
                conVal = eval(query.value);
            }
            _query[query.name] = conVal;
            break;
        case 'String':
            _query[query.name] = { $regex: query.value, $options: 'i' };
            break;
    }

    return [{ selector: _.assign(selector, _query), options }];
}
