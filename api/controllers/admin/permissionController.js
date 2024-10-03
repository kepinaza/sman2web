const Permission = require('../../models/permissionModel')

//GET ALL PERMISSION BY DEVELOPER
const getPermission = async (req, res) => {
    try {
        const permission = await Permission.find({});
        if(!permission) return res.status(404).json({message: "Permission tidak ditemukan"});
        return res.status(200).json(permission);
    } catch (error) {
        return res.status(400).json({message: "Permission gagal ditampilkan"});
    }
}

//ADD PERMISSION BY DEVELOPER
const addPermission = async(req, res) => {
    try {
        const {permission_name, permission_description} = req.body;
        const isExists = await Permission.findOne({
            permission_name: req.body.permission_name
        })
    
        if(isExists){
            return res.status(400).json({message: "Permission sudah tersedia"});
        }
    
        var obj = {
            permission_name,
            permission_description
        }
    
        if(req.body.default){
            obj.is_default = parseInt(req.body.default);
        }
    
        const permission = new Permission(obj);
        const newPermission = await permission.save();
    
        return res.status(201).json({message: "Permission berhasil ditambahkan", data: newPermission});
    } catch (error) {
        return res.status(400).json({message: "Permission gagal ditambahkan"});
    }
}

//UPDATE PERMISSION BY DEVELOPER
const updatePermission = async(req, res) => {
    try {
        const { id, permission_name, permission_description } = req.body;

        const isExists = await Permission.findOne({
            _id: id
        });
        if(!isExists) return res.status(404).json({message: "Permission tidak ditemukan"});
    
        const isAssigned = await Permission.findOne({
            _id: {$ne: id},
            permission_name
        });
        if(isAssigned) return res.status(400).json({message: "Nama permission sudah tersedia, pilih nama lain"});
    
        var updatePermission = {
            permission_name,
            permission_description
        }
    
        if(req.body.default){
            updatePermission.is_default = parseInt(req.body.default);
        }
    
        const updatedPermission = await Permission.findByIdAndUpdate({ _id: id },{
            $set: updatePermission
        }, {new:true});
    
        return res.status(200).json({message: "Permission berhasil diupdate", data: updatedPermission});
    } catch (error) {
        return res.status(400).json({message: "Permission gagal diupdate"});
    }
}

//DELETE PERMISSION BY DEVELOPER
const deletePermission = async(req, res) => {
    try {
        const {id} = req.body;
        const permission = await Permission.findById({ _id: id });
        if(!permission) return res.status(404).json({message: "Permission tidak ditemukan"});
        await Permission.findByIdAndDelete({ _id: id });

        return res.status(200).json({message: "Permission berhasil dihapus"});
    } catch (error) {
        return res.status(400).json({message: "Permission gagal dihapus"});
    }
}

module.exports = {
    getPermission,
    addPermission,
    updatePermission,
    deletePermission
};