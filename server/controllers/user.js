import User from '../models/User.js';

export const getUser = async(req, res) => {
    const userid = req.params.userid;
    const user = await User.findById(userid);
    if(!user){
        return res.status(400).json({
            message:'User not found',
        })
    }
    else{
        user.password = undefined;
        return res.status(200).json({
            message:'User has been found',
            user,
        })
    }
};

export const getUserFriends = async(req, res) => {
    const userid = req.params.userid;
    const user = await User.findById(userid);
    const friends = await user.friends.map((id) => User.findById(id));
    const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
        return {_id, firstName, lastName, occupation, location, picturePath}
    });
    return res.status(200).json({
        message:'User Friends are as follows',
        formattedFriends
    })
};

export const addRemoveFriend = async(req, res) => {
    const {id, friendId} = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if(user.friends.includes(friendId)){
        user.friends = user.friends.filter((id) => id!==friendId);
        friend.friends = friend.friends.filter((id) => id!==id);
    }
    else{
        user.friends.push(friendId);
        friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    const friends = await user.friends.map((id) => User.findById(id));
    const formattedFriends = friends.map(({_id, firstName, lastName, occupation, location, picturePath}) => {
        return {_id, firstName, lastName, occupation, location, picturePath}
    });
    return res.status(200).json({
        message:'User Friends are as follows',
        formattedFriends
    })
}