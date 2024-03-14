import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import {Op} from "sequelize";

export const getAllProducts = async (req, res) => { //ALL USER ROUTE
    try {
        let response;
            response = await Product.findAll({
              attributes: ['uuid', 'name','thumbnail', 'description', 'price'],
              include: [{
                model: User,
                attributes:['name', 'email']
              }]
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProducts = async (req, res) => { //ADMIN ONLY ROUTE
    try {
        let response;
        if(req.role === "admin"){
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'thumbnail', 'description', 'price'],
                include: [{
                    model: User,
                    attributes:['name', 'email']
                }]
            });
        } else {
            response = await Product.findAll({
                attributes: ['uuid', 'name', 'thumbnail', 'description', 'price'],
                where: {
                  userId: req.userId
                },
                include: [{
                  model: User,
                  attributes:['name', 'email']
                }]
              });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductById = async (req, res) => { //MERCHANT ROUTE
    try {
        const product = await Product.findOne({
          where:{
            uuid: req.params.id
          }  
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});

        let response;
        if(req.role === "admin"){
            response = await Product.findOne({
                attributes: ['uuid', 'name', 'thumbnail', 'description', 'price'],
                where:{
                    id: product.id
                },
                include: [{
                    model: User,
                    attributes:['name', 'email']
                }]
            });
        } else {
            response = await Product.findOne({
              attributes: ['uuid', 'name', 'thumbnail', 'description', 'price'],
              where: {
                [Op.and]:[{id: product.id}, {userId: req.userId}]
              },
              include: [{
                model: User,
                attributes:['name', 'email']
              }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getProductByIdNon = async (req, res) => { //MERCHANT ROUTE
    try {
        const product = await Product.findOne({
          where:{
            uuid: req.params.id
          }  
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});

        let response;

            response = await Product.findOne({
              attributes: ['uuid', 'name', 'thumbnail', 'description', 'price'],
              where:{
                id: product.id
              },
              include: [{
                model: User,
                attributes:['name', 'email']
              }]
            });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const createProducts = async (req, res) => { //ADMIN AND MERCHANT ROUTE
    const {name, description, price} = req.body;
    try {
        await Product.create({
            name: name,
            description: description,
            price: price,
            userId: req.userId
        });
        res.status(201).json({msg: "Product created successfully"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const updateProducts = async (req, res) => { //ADMIN AND MERCHANT ROUTE
    try {
        const product = await Product.findOne({
          where:{
            uuid: req.params.id
          }  
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, thumbnail, description, price} = req.body;
        let response;
        if(req.role === "admin"){
            await Product.update({name, thumbnail, description, price},{
                where:{
                    id: product.id
                }
            })
        } else {
            if(req.userId !== product.userId) return res.status(403).json({msg: "Anda tidak memiliki akses"});
            await Product.update({name, thumbnail, description, price},{
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({msg: "Data berhasil diubah"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const deleteProducts = async (req, res) => { //ADMIN AND MERCHANT ROUTE
    try {
        const product = await Product.findOne({
          where:{
            uuid: req.params.id
          }  
        });
        if(!product) return res.status(404).json({msg: "Data tidak ditemukan"});
        const {name, description, price} = req.body;
        let response;
        if(req.role === "admin"){
            await Product.destroy({
                where:{
                    id: product.id
                }
            })
        } else {
            if(req.userId !== product.userId) return res.status(403).json({msg: "Anda tidak memiliki akses"});
            await Product.destroy({
                where:{
                    [Op.and]:[{id: product.id}, {userId: req.userId}]
                }
            })
        }
        res.status(200).json({msg: "Data berhasil dihapus"});
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}