const AccessControl = require('role-acl');
const ac = new AccessControl();

// Grant user-role permissions on the DB users resource
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('create').on('postResource');  // user can only create a post for their own ID
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')  .on('postResource');  // user can only read a post for their own ID
// no update
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('postResource');  // user can only delete a post with their own ID

// Grant admin-role permissions on the DB posts resource
ac.grant('admin').execute('create').on('postResource'); // admin can create a post under any user's ID
ac.grant('admin').execute('read'  ).on('postResource'); // admin can read   a single post for any user's ID
// no update
ac.grant('admin').execute('delete').on('postResource'); // admin can delete a post for any user's ID

exports.create  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('create').sync().on('postResource');
exports.read    = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('read'  ).sync().on('postResource');
// no update
exports.delete  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('delete').sync().on('postResource');
    