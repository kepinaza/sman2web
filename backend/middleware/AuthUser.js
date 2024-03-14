import User from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
    if(!req.session.userId){
        return res.status(401).json({message: "Anda belum login."});
    }
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(401).json({message: "User tidak ditemukan."});
    req.userId = user.id;
    req.role = user.role;
    req.group = user.group;
    next();
}

export const adminOnly = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            uuid: req.session.userId
        }
    });
    if(!user) return res.status(401).json({message: "User tidak ditemukan."});
    if(user.role !== "admin") return res.status(403).json({message: "Akses Dilarang."});
    next();
}

export const hasLoginCantMakeAcc = async (req, res, next) => {
    if(req.session.userId){
        return res.status(401).json({message: "Anda sedang login, tidak bisa membuat akun baru."});
    }
    next();
}

// export const cantMakeAdmin = async (req, res, next) => {
//     if (!req.isAuthenticated()) {
//         const user = await User.findOne({
//             where: {
//                 role: req.role
//             }
//         });
//         if(user.role !== "admin") return res.status(400).json({ msg: "Akses Dilarang." });
//     }
//     next();
// }

// export const checkAdminRole = (req, res, next) => {
//     if (!req.isAuthenticated() && req.body.role === "admin") {
//         return res.status(400).json({ msg: "Unauthorized: Cannot assign 'admin' role." });
//     }
//     next();
// };

// export const merchantOnly = async (req, res, next) => {
//     const user = await User.findOne({
//         where: {
//             uuid: req.session.userId
//         }
//     });
//     if(!user) return res.status(401).json({message: "User tidak ditemukan."});
//     if(user.badge !== "merchant") return res.status(403).json({message: "Akses Dilarang."});
//     next();
// }