import bcrypt from 'bcryptjs';

import User from '../models/user.model.js';

const updateUserData = async (id, userObj) => {
  try {
    let hash;
    const user = await User.findOne({ _id: id }).exec();
    if (!user) throw new Error('user does not exist');

    if (userObj.hasOwnProperty('password'))
      hash = await bcrypt.hash(userObj.password, 8);
    Object.keys(userObj).forEach((key) => {
      if (userObj[key]) {
        if (key === 'password') {
          user.hash = hash;
        } else user[key] = userObj[key];
      }
    });

    user.updated_at = Date.now();
    const updatedUser = await user.save();
    if (!updatedUser) throw new Error('your data could not be updated');

    const newUserObj = updatedUser.toObject();
    delete newUserObj.hash;

    return {
      success: true,
      message: 'your data was successfully updated',
      user: newUserObj
    };
  } catch (err) {
    return {
      success: false,
      message: err.message
    };
  }
};

export default updateUserData;