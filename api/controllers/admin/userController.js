const argon2 = require("argon2");
const User = require("../../models/userModel");

const getUser = async (req, res) => {
    try {
        const user = await User.find({}).populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });
        if(!user) return res.status(404).json({message: "User tidak ditemukan"});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({message: "User gagal ditampilkan"});
    }
}

const getUserById = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({
            username
        }).populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });

        if(user) {
            return res.status(200).json({message: "User", data: user});
        } else {
            return res.status(404).json({message: "User tidak ditemukan"});
        }
    } catch (error) {
        return res.status(400).json({message: "User gagal ditampilkan"});
    }
}

const addUser = async (req, res) => {
    try {
        const {name, username, email, password} = req.body;
        if(!name || !username || !email || !password || name === '' || username === '' || email === '' || password === '') {
            return res.status(400).json({message: "Semua kolom wajib diisi"});
        }
        const user = await User.findOne({
            email: req.body.email
        });
        const usernameVal = await User.findOne({
            username: req.body.username
        });
        if(user) return res.status(400).json({message: "Email sudah terdaftar"});
        if(usernameVal) return res.status(400).json({message: "Username sudah terdaftar"});
        const hashPassword = await argon2.hash(password);
    
        const userData = new User({
            name: name,
            username: username,
            email: email,
            password: hashPassword
        });

        if(req.body.role) {
            userData.role = req.body.role;
        }

        const createUser = await userData.save();
        res.status(201).json({message: "Register berhasil", data: createUser});
    } catch (error) {
        res.status(400).json({message: "Register gagal", data: error});
    }
}

const updateUser = async (req, res) => {
    try {
        const {id, name, username, email, password} = req.body;

        const userData = await User.findOne({
            _id: id
        });
        if(!userData) return res.status(404).json({message: "User tidak ditemukan"});

        const user = await User.findOne({
            _id: {$ne: id},
            email: req.body.email
        });
        const usernameVal = await User.findOne({
            _id: {$ne: id},
            username: req.body.username
        });
        if(user) return res.status(400).json({message: "Email sudah terdaftar"});
        if(usernameVal) return res.status(400).json({message: "Username sudah terdaftar"});
        const hashPassword = await argon2.hash(password);

        var updateUser = {
            name,
            username,
            email,
            password: hashPassword
        }

        if(req.body.role) {
            updateUser.role = req.body.role;
        }

        const updatedData = await User.findByIdAndUpdate({ _id: id }, {
            $set: updateUser
        }, {new:true});

        return res.status(200).json({message: "User berhasil diupdate", data: updatedData});
    } catch (error) {
        return res.status(400).json({message: "User gagal diupdate"});
    }
}

const deleteUser = async (req, res) => {
    try {
        const {id} = req.body;
        const user = await User.findById({ _id: id });
        if(!user) return res.status(404).json({message: "User tidak ditemukan"});
        await User.findByIdAndDelete({ _id: id });
        return res.status(200).json({message: "User berhasil dihapus"});
    } catch (error) {
        return res.status(400).json({message: "User gagal dihapus"});
    }
}

module.exports = {
    getUser,
    getUserById,
    addUser,
    updateUser,
    deleteUser
}