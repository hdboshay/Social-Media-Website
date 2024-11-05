const AccessControl = require('role-acl');
const ac = new AccessControl();

// Grant user-role permissions on the DB users resource
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('create').on('likeResource');  // user can only create a like for a post 
                                                                                                                // using their own ID
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('read')  .on('likeResource');  // user can only see if they have liked a specific post
                                                                                                                // but cannot ask if another user has liked a specific post
// no update
ac.grant('user').condition({Fn:'EQUALS', args: {'requester':'$.owner'}}).execute('delete').on('likeResource');  // user can only delete a like with their own ID

// Grant admin-role permissions on the DB posts resource
ac.grant('admin').execute('create').on('likeResource'); // admin can create a like using any user's ID
ac.grant('admin').execute('read'  ).on('likeResource'); // admin can query if any user has liked any Post
// no update
ac.grant('admin').execute('delete').on('likeResource'); // admin can delete a like for any user's ID

exports.create  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('create').sync().on('likeResource');
exports.read    = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('read'  ).sync().on('likeResource');
// no update
exports.delete  = (requester_role, requester, owner) => ac.can(requester_role).context({requester:requester, owner:owner}).execute('delete').sync().on('likeResource');
    