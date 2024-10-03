const Category = require('../../models/categoryModel');

//GET ALL CATEGORY BY ADMIN
const getCategory = async (req, res) => {
    try {
        const category = await Category.find({});
        if(!category) return res.status(404).json({message: "Kategori tidak ditemukan"});
        return res.status(200).json(category);
    } catch (error) {
        return res.status(400).json({message: "Kategori gagal ditampilkan"})
    }
}

//ADD CATEGORY BY ADMIN
const addCategory = async (req, res) => {
    try {        
        const {category_name} = req.body;
        if (!category_name || category_name === '') {
            return res.status(400).json({ message: 'Semua kolom wajib diisi' });
        }  
    
        const isExists = await Category.findOne({
            category_name: category_name
        });
        if(isExists) return res.status(400).json({message: "Kategori sudah tersedia"});
    
        const category = new Category({
            category_name: category_name
        });
    
        const categoryData = await category.save();

        return res.status(201).json({ message: 'Kategori berhasil ditambahkan', data: categoryData });
    } catch (error) {
        return res.status(400).json({ message: 'Gagal menambahkan kategori' });    
    }
}

//UPDATE CATEGORY BY ADMIN
const updateCategory = async(req, res) => {
    try {
        const { id, category_name, category_description } = req.body;

        const categoryData = await Category.findOne({
            _id: id
        });
        if(!categoryData) return res.status(404).json({message: "Kategory tidak ditemukan"});

        const isAssigned = await Category.findOne({
            _id: {$ne: id},
            category_name: category_name
        });
        if(isAssigned) return res.status(400).json({message: "Nama Kategori sudah tersedia, pilih nama lain"});

        var updateCategory = {
            category_name,
            category_description
        }

        const updatedData = await Category.findByIdAndUpdate({ _id: id }, {
            $set: updateCategory
        }, {new: true});

        return res.status(200).json({message: "Kategori berhasil diupdate", data: updatedData});
    } catch (error) {
        return res.status(400).json({message: "Kategori gagal dihapus"})
    }
}

//DELETE CATEGORY BY ADMIN
const deleteCategory = async(req, res) => {
    try {
        const {id} = req.body;
        const category = await Category.findById({ _id: id });
        if(!category) return res.status(404).json({message: "Kategori tidak ditemukan"});
        await Category.findByIdAndDelete({ _id: id });
        return res.status(200).json({message: "Kategori berhasil dihapus"});
    } catch (error) {
        return res.status(400).json({message: "Kategori gagal dihapus"})
    }
}

module.exports = {
    getCategory,
    addCategory,
    updateCategory,
    deleteCategory
}