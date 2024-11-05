const AccessControl = require('role-acl');
const ac = new AccessControl();

// Grant user-role permissions on the DB users resource
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('create').on('commentResource');  // user can only create a comment for a post 
                                                                                                                   // using their own ID

// no read (open api)
// no update
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('commentResource');  // user can only delete a comment with their own ID

// Grant admin-role permissions on the DB posts resource
ac.grant('admin').execute('create').on('commentResource'); // admin can create a comment using any user's ID
// no read (open api)
// no update
ac.grant('admin').execute('delete').on('commentResource'); // admin can delete a comment for any user's ID

exports.create  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('create').sync().on('commentResource');
// no read (open api)
// no update
exports.delete  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('delete').sync().on('commentResource');
    