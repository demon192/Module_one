import User from '../models/user.model.js';

const getUserData = async (id, tokenId) => {
  try {
    const user = await User.findOne({ _id: id }).exec();
    if (!user) throw new Error('invalid id provided');

    if (id === tokenId) {
      const userObj = user.toObject();
      delete userObj.hash;
      return {
        success: true,
        message: 'user data was successfully fetched',
        user: userObj
      };
    } else {
      return {
        success: true,
        message: 'user data was successfully fetched',
        user: { _id: user._id, fname: user.fname, lname: user.lname }
      };
    }
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};

export default getUserData;