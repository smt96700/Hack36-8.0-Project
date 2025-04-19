import nodemailer from 'nodemailer';
import User from '@/models/user';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_EMAIL_PASSWORD,
  },
});

export const getUserEmail = async (userId: string): Promise<string | null> => {
    try {
      const user = await User.findById(userId).select('email');
      console.log(`User found: ${user}`);
      return user?.email || null;
    } catch (error) {
      console.error('Error fetching user email:', error);
      return null;
    }
  };

export const sendEmailReminder = async (userId: string, plantId: string) => {
  // Get the user's email address from your database using userId
  const userEmail = await getUserEmail(userId); // Implement this function to fetch email from DB
  if (!userEmail) {
    console.error(`No email found for user ID: ${userId}`);
    return;
  }
  
  // Construct email content (you can personalize this as per your requirements)
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: userEmail,
    subject: `Reminder: Time to Water Your Plant`,
    text: `Hello! It's time to water your plant with ID: ${plantId}. Please make sure to hydrate it.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
