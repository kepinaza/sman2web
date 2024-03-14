import express from 'express';
import {
    getAllProducts,
    getProducts,
    getProductById,
    getProductByIdNon,
    createProducts,
    updateProducts,
    deleteProducts
} from "../controllers/Products.js"
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/products', getAllProducts);
router.get('/products/:id', getProductByIdNon);
router.get('/dashboard/products', verifyUser, getProducts); 
router.get('/dashboard/products/:id', verifyUser, getProductById);
router.post('/dashboard/add/products', verifyUser, createProducts);
router.patch('/dahboard/edit/products/:id', verifyUser, updateProducts);
router.delete('/dashboard/delete/products/:id', verifyUser, deleteProducts);

export default router;