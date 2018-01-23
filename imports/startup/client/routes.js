import  _ from 'lodash';

import RouterAdmin from '../../client/routes';
import RouterUser from '../../client/routesUser';

const routes = _.concat(
    RouterAdmin,
    RouterUser
);

export default routes;