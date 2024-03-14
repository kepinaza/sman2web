import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => { //ADMIN ROUTE
    try {
        const response = await User.findAll({
            attributes: ["uuid", "name", "username", "profile", "email", "role", "group","createdAt"]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }   
}

export const getUserById = async (req, res) => { // ALL USER ROUTE (MAYBE)
    try {
        const response = await User.findOne({
            attributes: ["uuid", "name", "username", "profile", "email", "role", "group", "createdAt"],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }   
}

export const createUsers = async (req, res) => { // ADMIN ROUTE
    const {name, username, email, password, confPassword} = req.body;
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });
    if(user) return res.status(400).json({ msg: "Email sudah terdaftar." });
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

export const updateUsers = async (req, res) => { //ADMIN ROUTE
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({ msg: "User tidak ditemukan." });
    const {name, username, profile, email, password, confPassword, role, group} = req.body;
    let hashPassword;
    if(password === "" || password === null){
        hashPassword = user.password;
    } else {
        hashPassword = await argon2.hash(password);
    }
    if(password !== confPassword) return res.status(400).json({ msg: "Password dan Confirm Password tidak sama." });
    try {
        await User.update({
            name: name,
            username: username,
            profile: profile,
            email: email,
            password: hashPassword,
            role: role,
            group: group
        },{
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User berhasil di perbarui." });
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}

export const deleteUsers = async (req, res) => { //ADMIN ROUTE
    const user = await User.findOne({
        where: {
            uuid: req.params.id
        }
    });
    if(!user) return res.status(404).json({ msg: "User tidak ditemukan." });
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ msg: "User berhasil di hapus." });
    } catch (error) {
        res.status(400).json({msg: error.message})
    }
}