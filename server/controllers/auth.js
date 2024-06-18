import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'

export const register = async(req, res) => {
    const {firstName, lastName, email, password, picturePath, friends, location, occupation} = req.body;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
        firstName, 
        lastName, 
        email, 
        password: hashedPassword, 
        picturePath, 
        friends, 
        location, 
        occupation,
        viewedProfile: Math.floor(Math.random() * 1000),
        impressions: Math.floor(Math.random() * 1000)
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
};

export const login = async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(400).json({
            message:'User not found',
        });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({
            message:'Invalid Password'
        })
    }

    const token = jwt.sign({
        id:user._id,
        firstName:user.firstName,
        lastName:user.lastName,
        email:user.email
    },process.env.SECRET);
    delete user.password;
    return res.status(200).json({
        message:'Login Successfull',
        user,
        token,
    })
};