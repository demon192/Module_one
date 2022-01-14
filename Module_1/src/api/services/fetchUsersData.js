import User from '../models/user.model.js';

const fetchUsersData = async (name, email) => {
  const pattern = `.*${name}.*`;
  const userProj = {
    fname: true,
    lname: true
  };

  try {
    const users = await User.find(
      {
        $or: [
          {
            $or: [
              { fname: { $regex: pattern, $options: 'i' } },
              { lname: { $regex: pattern, $options: 'i' } }
            ]
          },
          { email }
        ]
      },
      userProj,
      { limit: 100 }
    );

    if (!users) throw new Error('no user found');

    return users;
  } catch (err) {
    throw err;
  }
};

export default fetchUsersData;