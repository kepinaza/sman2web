const Post = require('../../models/postModel');

const getPost = async (req, res) => {
    try {
        const post = await Post.find({}).populate('categories');
        if(!post) return res.status(404).json({message: "Postingan tidak ditemukan"});
        return res.status(200).json(post);
    } catch (error) {
        return res.status(400).json({message: "Gagal menampilkan postingan"});
    }
}

const convertToSlug = (text) => {
    return text
          .toLowerCase()             // Convert to lowercase
          .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric characters except spaces and hyphens
          .trim()                    // Remove leading and trailing spaces
          .replace(/\s+/g, '-')      // Replace spaces with hyphens
          .replace(/-+/g, '-');      // Replace multiple hyphens with a single hyphen
}

// const getPostByTitle = async (req, res) => {
//     try {
//         const {title} = req.params;
//         const post = await Post.findOne({
//             title
//         });
//         const convert = post(post)

//         if(post) {

//         }
//     } catch (error) {
        
//     }
// }

module.exports = {
    getPost
}