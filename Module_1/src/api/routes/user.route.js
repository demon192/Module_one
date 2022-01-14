import express from 'express';

import {
  signupUser,
  verifyEmail,
  loginUser,
  sendUserData,
  updateUser,
  findUsers,
  resetPassword
} from '../controllers/user.controller.js';
import {
  checkDuplicateEmail,
  validateSignupBody,
  verifyDecodeJWT,
  verifyLoginCredentials,
  verifyDecodeBearerToken,
  validateResetPassword
} from '../middlewares/user.middleware.js';

const userRouter = express.Router();

userRouter.post(
  '/signup',
  [validateSignupBody, checkDuplicateEmail],
  signupUser
);
userRouter.get('/verify_email', verifyDecodeJWT, verifyEmail);
userRouter.post('/login', verifyLoginCredentials, loginUser);
userRouter.get('/search', verifyDecodeBearerToken, findUsers);
userRouter.post('/forgot_password', validateResetPassword, resetPassword);
userRouter.get('/:id', verifyDecodeBearerToken, sendUserData);
userRouter.put('/:id', verifyDecodeBearerToken, updateUser);

export default userRouter;