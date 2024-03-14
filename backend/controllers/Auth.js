import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Register = async (req, res) => {
    const {name, username, email, password, confPassword} = req.body;
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(user) return res.status(400).json({ msg: "Email sudah terdaftar." });
    if(username) return res.status(400).json({ msg: "Username sudah terdaftar." });
    if(password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak sama." });
    const hashPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            username: username,
            email: email,
            password: hashPassword,
        });
        res.status(201).json({ msg: "Register Berhasil." });
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(!user) return res.status(404).json({msg: "Email atau Password salah."});
    const match = await argon2.verify(user.password, req.body.password);
    if(!match) return res.status(400).json({msg: "Email atau Password salah."});
    // jika login berhasil
    req.session.userId = user.uuid;
    const uuid = user.uuid;
    const name = user.name;
    const username = user.username;
    const profile = user.profile;
    const email = user.email;
    const role = user.role;
    const group = user.group;
    res.status(200).json({uuid, name, username, profile, email, role, group});
}

export const Me = async (req, res) => {
    if(!req.session.userId){
        return res.status(401).json({msg: "Anda belum login."});
    }
    const user = await User.findOne({
        attributes: ["uuid", "name", "username", "profile", "email", "role", "group"],
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(404).json({msg: "User tidak ditemukan."});
    res.status(200).json(user);
}

export const LogOut = (req, res) => {
    req.session.destroy((err) => {
        if(err) return res.status(400).json({msg: "Logout gagal."});
        res.status(200).json({msg: "Logout berhasil."});
    });
}