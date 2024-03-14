import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Groups from "../models/GroupModel.js";
import argon2 from "argon2";

const {DataTypes} = Sequelize;

const Users = db.define('users', {
    uuid:{
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [1, 200]
        }
    },
    username:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            len: [1, 60]
        }
    },
    profile:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "defaultprofile.jpg",
        validate:{
            notEmpty: true
        }
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            notEmpty: true
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate:{
            notEmpty: true
        }
    },
    group:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "none",
        validate:{
            notEmpty: true
        }
    }
},{
    freezeTableName: true
});

// Users.sync()
// .then(async () => {
//     const hashPassword = await argon2.hash('admin');
//     const usersCount = await Users.count();
//     if (usersCount === 0) {
//         await Users.create({
//             name: "admin",
//             username: 'admin',
//             email: 'admin@admin.com',
//             password: hashPassword,
//             role: 'admin'
//         });
//         console.log('Default user +');
//     } else {
//         console.log('Table already exists');
//     }
// })

export default Users;