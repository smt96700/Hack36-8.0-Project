import nodemailer from 'nodemailer';
import User from '@/models/user';
import {nanoid} from 'nanoid';
import Plant from '@/models/plant';


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

export const sendEmailReminder = async (userId: string, plantName: string, plantId: string) => {
  // Get the user's email address from your database using userId
  const userEmail = await getUserEmail(userId); // Implement this function to fetch email from DB
  const plant= await Plant.findById(plantId);
 
  const token= nanoid();
  plant.waterToken= token;
  await plant.save();
  console.log("email token: ", token);
  if (!userEmail) {
    console.error(`No email found for user ID: ${userId}`);
    return;
  }
  
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: userEmail,
    subject: `🌿 Reminder: Time to Water Your Plant`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          <h2 style="color: #2e7d32;">🌱 Time to Water Your Plant!</h2>
          <p>Hello there 👋,</p>
          <p>This is a gentle reminder to water your beloved plant: <strong>${plantName}</strong>.</p>
          <p>Keeping it hydrated helps it grow and thrive. 🌿</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.BASE_URL}/api/waterPlant/${plantId}?token=${token}" style="background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; border-radius: 8px;">
              💧 Water the Plant
            </a>
          </div>
          <p style="font-size: 14px; color: #555;">Thank you for being a responsible plant parent! 🌸</p>
        </div>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reminder sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
