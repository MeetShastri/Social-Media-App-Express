import Post from '../models/Post.js';
import User from '../models/User.js';

export const addPost = async(req, res) => {
    const {userId, description, picturePath} = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        likes:{},
        comments:[]
    }) 
     await newPost.save();
     const post = await Post.find();
     res.status(201).json({
        message:'Post has been created',
        post
     })
};

export const getFeedPosts = async(req, res) => {
    const posts = await Post.find();
    if(posts){
        return res.status(200).json({
            message:'Feed Post are as follows',
            posts
        })
    }
    else{
        return res.status(400).json({
            message:'No Posts',
        })
    }
};

export const getUserPosts = async(req, res) => {
    const userId = req.params.userid;
    const posts = await Post.find({userId});
    if(posts.length>0){
        return res.status(200).json({
            message:'All User Posts are as follows',
            posts
        })
    }
    else{
        return res.status(400).json({
            message:"No posts for this user",
        })
    }
};

export const updateLikePost = async(req, res) => {
    const id = req.params.id;
    const {userId} = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if(isLiked){
        post.likes.delete(userId);
    }
    else{
        post.likes.set(userId, true);
    }
    const updatedPost = await Post.findByIdAndUpdate(
        id,
        {likes: post.likes},
        {new: true}
    );
    res.status(200).json(updatedPost);
}