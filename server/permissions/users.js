const AccessControl = require('role-acl');
const ac = new AccessControl();

// Grant user-role permissions on the DB users resource
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')  .on('userResource');

// Grant admin-role permissions on the DB users resource
ac.grant('admin').execute('read'  ).on('usersResource');
ac.grant('admin').execute('read'  ).on('userResource');
ac.grant('admin').condition({Fn:'NOT_EQUALS', args:{'requester':'$.owner'}}).execute('delete').on('userResource');

exports.readAll = (requester_role)                   => ac.can(requester_role).execute('read').sync().on('usersResource');
exports.read    = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('read'  ).sync().on('userResource');
exports.delete  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('delete').sync().on('userResource');

// TODO: when adding delete, make sure delete permission is refused when owner == requestor (ie. cant delete own account)