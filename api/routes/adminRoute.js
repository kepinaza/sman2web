const {getPermission, addPermission, updatePermission, deletePermission} = require('../controllers/admin/permissionController');
const {getCategory, addCategory, updateCategory, deleteCategory} = require('../controllers/admin/categoryController');
const {getPost, getPostById, addPost, updatePost, deletePost} = require('../controllers/admin/postController');
const {getUser, getUserById, addUser, updateUser, deleteUser} = require('../controllers/admin/userController');
const {getRole, getRoleById, addRole, updateRole, deleteRole} = require('../controllers/admin/roleController');
const { verifyUser, verifyToken } = require('../middlewares/AuthUser');
const {hasPermission} = require('../middlewares/RBAC');
const express = require('express');

const router = express.Router();

//PERMISSION ROUTER
router.get('/permission', verifyUser, verifyToken, hasPermission('get-permission'), getPermission);
router.post('/add-permission', verifyUser, verifyToken, hasPermission('add-permission'), addPermission);
router.patch('/edit-permission', verifyUser, verifyToken, hasPermission('update-permission'), updatePermission);
router.delete('/delete-permission', verifyUser, verifyToken, hasPermission('delete-permission'), deletePermission);

//CATEGORY ROUTER
router.get('/category', verifyUser, verifyToken, hasPermission('get-category'), getCategory);
router.post('/add-category', verifyUser, verifyToken, hasPermission('add-category'), addCategory);
router.patch('/edit-category', verifyUser, verifyToken, hasPermission('update-category'), updateCategory);
router.delete('/delete-category', verifyUser, verifyToken, hasPermission('delete-category'), deleteCategory);

//POST ROUTER
router.get('/post', verifyUser, verifyToken, hasPermission('get-post'), getPost);
router.get('/post/:title', verifyUser, verifyToken, getPostById);
router.post('/add-post', verifyUser, verifyToken, hasPermission('add-post'), addPost);
router.patch('/edit-post', verifyUser, verifyToken, hasPermission('update-post'), updatePost);
router.delete('/delete-post', verifyUser, verifyToken, hasPermission('delete-post'), deletePost);

//ROLE ROUTER
router.get('/role', verifyUser, verifyToken, hasPermission('get-role'), getRole);
router.get('/role/:value', verifyUser, verifyToken, getRoleById);
router.post('/add-role', verifyUser, verifyToken, hasPermission('add-role'), addRole);
router.patch('/edit-role', verifyUser, verifyToken, hasPermission('update-role'), updateRole);
router.delete('/delete-role', verifyUser, verifyToken, hasPermission('delete-role'), deleteRole);

//USER CONTROL ROUTER
router.get('/user', verifyUser, verifyToken, hasPermission('get-user'), getUser);
router.get('/user/:username', verifyUser, verifyToken, getUserById);
router.post('/add-user', verifyUser, verifyToken, hasPermission('add-user'), addUser);
router.patch('/edit-user', verifyUser, verifyToken, hasPermission('update-user'), updateUser);
router.delete('/delete-user', verifyUser, verifyToken, hasPermission('delete-user'), deleteUser);

module.exports = router;
