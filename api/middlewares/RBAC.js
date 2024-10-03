const User = require('../models/userModel');
const Role = require('../models/roleModel');
const Perm = require('../models/permissionModel');

exports.hasPermission = (permission) => {
    return async (req, res, next) => {
        try {
            const user = await User.findOne({
                _id: req.session.userId
            });
            const role = await Role.findById(user.role);
            const permissions = await Perm.find({ _id: { $in: role.permissions }});
    
            const hasPermission = permissions.some(function(permissionss) {
                return permissionss.permission_name === permission || permissionss.permission_name === 'all-perm';
            });
    
            if(hasPermission) {
                return next();
            } else {
                return res.status(403).json({message: "Anda tidak memiliki akses untuk halaman ini"});
            }
        } catch (error) {
            return res.status(404).json({message: "Error"});
        }
    };
};