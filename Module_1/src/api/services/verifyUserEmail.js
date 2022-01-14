import User from '../models/user.model.js';

const verifyUserEmail = async (id) => {
  try {
    const user = await User.findById(id);
    user.verified = true;
    const updatedUser = await user.save();
  } catch (err) {
    throw err;
  }
};

export default verifyUserEmail;