import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';
import sendVerificationEmail from '../services/sendVerificationEmail';
import verifyUserEmail from '../services/verifyUserEmail';
import getUserData from '../services/getUserData';
import updateUserData from '../services/updateUserData';
import fetchUserData from '../services/fetchUsersData';

const signupUser = async (req,res) => {
    const { fname, lname, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 8);

        const newUser = new User({
            fname,
            lname,
            email,
            hash
        });

        const resNewUser = await newUser.save();

        const vEmail = await sendVerificationEmail(
            'Social App API',
            'Email Verification',
            resNewUser
        );

        res.status(201).json({
            success: true,
            message : 'You have successfully signed up, please visit your email to verify your email ',
            data: { id: resNewUser._id}
        });
    }catch(err) {
        res.status(409).json({message: err.message});
    }
};

const verifyEmail = async (req, res) => {
    try {
      await verifyUserEmail(req.body.id);
      res
        .status(200)
        .json({ success: true, message: 'your email was verified successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  const loginUser = (req, res) => {
    const {
      user: { email, _id: id, fname, lname }
    } = req.body;
    const token = jwt.sign({ id, fname, lname, email }, process.env.JWT_SECRET);
    res.status(200).json({
      success: true,
      message: 'you have successfully logged in',
      user: { id, fname, lname, email },
      token
    });
  };
  
  const sendUserData = async (req, res) => {
    const { id } = req.params;
  
    try {
      if (!id) throw new Error('no id provided');
  
      const result = await getUserData(id, req.body.tokenData.id);
      if (!result.success) throw new Error(result.message);
  
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { tokenData, ...userNewData } = req.body;
  
    if (id !== tokenData.id) {
      res
        .status(401)
        .json({ success: false, message: 'you can only update your own data' });
    }
    try {
      const result = await updateUserData(id, userNewData);
      if (!result.success) throw new Error(result);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  const findUsers = async (req, res) => {
    const { username, email } = req.query;
    try {
      if (!username && !email) throw new Error('please provide a search term');
      const data = await fetchUsersData(username, email);
      res
        .status(200)
        .json({ success: true, message: 'following users were found', data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  const resetPassword = async (req, res) => {
    const { id, password } = req.body;
    try {
      const result = await updateUserData(id, { password });
  
      if (!result.success) throw new Error(result);
      res
        .status(200)
        .json({ success: true, message: 'password was successfully reset' });
    } catch (err) {
      res.status(500).json(err);
    }
  };
  
  export {
    signupUser,
    verifyEmail,
    loginUser,
    sendUserData,
    updateUser,
    findUsers,
    resetPassword
  };