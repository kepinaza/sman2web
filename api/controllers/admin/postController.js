const Post = require('../../models/postModel');

const getPost = async (req, res) => {
    try {
        const post = await Post.find({}).populate('categories');
        if(!post) return res.status(404).json({message: "Postingan tidak ditemukan"});
        return res.status(200).json(post)
    } catch (error) {
        return res.status(400).json({message: "Gagal menampilkan postingan"});
    }
}

const getPostById = async (req, res) => {
    try {
        const {title} = req.params;
        const post = await Post.findOne({
            title
        });
        if(post) {
            return res.status(200).json({message: "Postingan", data: post});
        } else {
            return res.status(400).json({message: "Postingan tidak ditemukan"});
        }
    } catch (error) {
        return res.status(400).json({message: "Postingan gagal ditampilkan"});
    }
}

const addPost = async (req, res) => {
    try {
        const {title, description} = req.body;

        var obj = {
            title,
            description
        }
    
        if(req.body.categories){
            obj.categories = req.body.categories;
        }
    
        const post = new Post( obj );
        const postData = await post.save();
        const postFullData = await Post.findOne({ _id: postData._id }).populate('categories');
    
        return res.status(201).json({message: "Postingan berhasil ditambahkan", data: postFullData});
    } catch (error) {
        return res.status(400).json({message: "Postingan gagal ditambahkan"});    
    }
}

const updatePost = async (req, res) => {
    try {
        const { id, title, description } = req.body;

        const isExists = await Post.findOne({
            _id: id
        });
        if(!isExists) return res.status(404).json({message: "Postingan tidak ditemukan"});
    
        var updatePost = {
            title,
            description
        }
    
        if(req.body.categories){
            updatePost.categories = req.body.categories;
        }
    
        const updatedPost = await Post.findByIdAndUpdate({ _id: id },{
            $set: updatePost
        }, {new:true});
    
        return res.status(200).json({message: "Postingan berhasil diupdate", data: updatedPost});
    } catch (error) {
        return res.status(400).json({message: "Postingan gagal diupdate"})    
    }
}

const deletePost = async (req, res) => {
    try {
        const {id} = req.body;
        const post = await Post.findById({ _id: id });
        if(!post) return res.status(404).json({message: "Postingan tidak ditemukan"});
        await Post.findByIdAndDelete({ _id: id });
        return res.status(200).json({message: "Postingan berhasil dihapus"});
    } catch (error) {
        return res.status(400).json({message: "Postingan gagal di hapus"});
    }
}

module.exports = {
    getPost,
    getPostById,
    addPost,
    updatePost,
    deletePost
}