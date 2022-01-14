import jwt from 'jsonwebtoken';
import axios from 'axios';

const generateLink = async (id) => {
  const { BASE_URL } = process.env;
  try {
    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 3600
    });
    return `${BASE_URL}/users/verify_email?secret=${token}`;
  } catch (err) {
    console.log(err.message);
  }
};

const generateEmail = async (id) => {
  const link = await generateLink(id);
  const text = `Hooray!!!\nYou have successfully signed up, to verify your email, please visit the link below in a new tab. The link will expire in one hour.\n
  link: ${link}`;

  const markup = `
    <div>
      <h3>Hooray!!!</h3>
      <p>You have successfully signed up, to verify your email, please click the link below. The link will expire in one hour.</p>
      <a href="${link}" target="_blank">Verify Email</a>
    </div>
  `;
  return { text, markup };
};

const sendVerificationEmail = async (from, subject, user) => {
  const { MAILER_URL } = process.env;
  const { text, markup: html } = await generateEmail(user._id);
  try {
    const info = await axios.post(
      MAILER_URL,
      JSON.stringify({ from, reciever: user.email, subject, text, html }),
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return info;
  } catch (err) {
    throw err;
  }
};

export default sendVerificationEmail;