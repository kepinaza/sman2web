const User = require('../models/userModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');

//USER REGISTER FUNCTION
const registerUser = async(req, res) => {
    try {
        const {name, username, email, password} = req.body;
        if (!name || !username || !email || !password || name === '' || username === '' || email === '' || password === '') {
            return res.status(400).json({ message: 'Semua kolom wajib diisi' });
        }    
        const user = await User.findOne({
            email: req.body.email
        });
        const usernameVal = await User.findOne({
            username: req.body.username
        })
        if(user) return res.status(400).json({message: "Email sudah terdaftar"});
        if(usernameVal) return res.status(400).json({message: "Username sudah terdaftar"});
        const hashPassword = await argon2.hash(password);

        const userData = new User({
            name: name,
            username: username,
            email: email,
            password: hashPassword,
        });
        const createUser = await userData.save();
        res.status(201).json({message: "Register berhasil", data: createUser});
    } catch (error) {
        res.status(400).json({message: "Register gagal"});
    }
}

const generateAccessToken = (user) => {
    const token = jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: "24h"})
    return token;
}

//USER LOGIN FUNCTION
const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        }).populate({
            path: 'role',
            populate: {
                path: 'permissions'
            }
        });
        if(!user) return res.status(400).json({message: "Email atau Password salah"});
        const match = await argon2.verify(user.password, req.body.password);
        if(!match) return res.status(400).json({message: "Email atau Password salah"});
        
        const userToken = await User.findOne({
            userId: req.body.userId
        }).select('-password');
        const accessToken = await generateAccessToken({
            user: userToken
        });

        req.session.userId = user._id;

        res.status(200).json({
            message: "Login berhasil",
            accessToken: accessToken,
            tokenType: 'Bearer',
            data: user
        });
    } catch (error) {
        res.status(400).json({message: "Login gagal"});
    }
}

//USER PROFILE FUNCTION
const Me = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.session.userId
        }).select('-password');
        if(!user) return res.status(404).json({message: "User tidak ditemukan"});
        res.status(200).json({message: "Profile", data:user});
    } catch (error) {
        res.status(400).json({message: "Gagal menampilkan profile"});
    } 
}

//USER LOGOUT FUNCTION
const logOut = async (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({message: "Logout gagal"});
        res.status(200).json({message: "Logout"});
    })
}

module.exports = {
    registerUser,
    loginUser,
    Me,
    logOut
};