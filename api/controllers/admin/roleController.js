const Role = require('../../models/roleModel');

const getRole = async (req, res) => {
    try {
        const roles = await Role.find({}).populate('permissions');
        if(!roles) return res.status(404).json({message: "Role tidak ditemukan"});
        return res.status(200).json(roles);
    } catch (error) {
        return res.status(400).json({message: "Role gagal ditampilkan"});
    }
}

const getRoleById = async (req, res) => {
    try {
        const {value} = req.params;
        const role = await Role.findOne({
            value
        });
        if(value) {
            return res.status(200).json({message: "Role", data: role});
        } else {
            return res.status(400).json({message: "Role tidak ditemukan"});
        }
    } catch (error) {
        return res.status(400).json({message: "Role gagal ditampilkan"});
    }
}

const addRole = async (req, res) => {
    try {
        const {role_name} = req.body;

        const isExists = await Role.findOne({
            role_name: role_name
        });
        if(isExists) return res.status(400).json({message: "Role sudah tersedia"});
    
        var obj = {
            role_name
        }
    
        if(req.body.value){
            obj.value = parseInt(req.body.value);
        }
        
        if(req.body.permissions){
            obj.permissions = req.body.permissions
        }
    
        const roles = new Role(obj);
        const roleData = await roles.save();
        const roleFullData = await Role.findOne({ _id: roleData._id}).populate('permissions');

        return res.status(201).json({message: "Role berhasil ditambahkan", data: roleFullData});
    } catch (error) {
        return res.status(400).json({message: "Role gagal ditambahkan"});
    }
}

const updateRole = async (req, res) => {
    try {
        const {id, role_name} = req.body;

        const isExists = await Role.findOne({
            _id: id
        });
        if(!isExists) return res.status(404).json({message: "Role tidak ditemukan"});
    
        const isAssigned = await Role.findOne({
            _id: {$ne: id},
            role_name
        });
        if(isAssigned) return res.status(400).json({message: "Nama Role sudah tersedia, pilih nama lain"});
    
        var updateRole = {
            role_name
        }
    
        if(req.body.value){
            updateRole.value = parseInt(req.body.value);
        }
        
        if(req.body.permissions){
            updateRole.permissions = req.body.permissions
        }
    
        const updatedRole = await Role.findByIdAndUpdate({ _id: id },{
            $set: updateRole
        }, {new:true});
    
        return res.status(200).json({message: "Role berhasil diupdate", data: updatedRole});
    } catch (error) {
        return res.status(400).json({message: "Role gagal diupdate"});    
    }
}

const deleteRole = async (req, res) => {
    try {
        const {id} = req.body;
        const roles = await Role.findById({ _id: id });
        if(!roles) return res.status(404).json({message: "Role tidak ditemukan"});
        await Role.findByIdAndDelete({ _id: id });

        return res.status(200).json({message: "Role berhasil dihapus"});
    } catch (error) {
        return res.status(400).json({message: "Role gagal dihapus"});
    }
}

module.exports = {
    getRole,
    getRoleById,
    addRole,
    updateRole,
    deleteRole,
}