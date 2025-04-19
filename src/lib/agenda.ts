
import { Agenda, Job } from 'agenda';
import { sendEmailReminder } from './email';

interface ReminderJobData {
    userId: string;
    plantId: string;
};

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL || 'mongodb://localhost:27017/your-db-name',
    collection: 'agendaJobs'
  }
});


agenda.define('send watering reminder', async (job: Job<ReminderJobData>) => {
  const { userId, plantId } = job.attrs.data;
  console.log(`Sending reminder to user:`);

 
  await sendEmailReminder(userId, plantId);
});


// const initializeAgenda = async () => {
//   await connectMongoDB(); 
//   await agenda.start(); 
// };

await agenda.start();

// Call initializeAgenda to connect and start Agenda
// initializeAgenda();

export const scheduleReminder = async (nextWateringTime: Date, userId: string, plantId: string) => {
  try {
    await agenda.schedule(nextWateringTime, 'send watering reminder', {
      userId,
      plantId,
    });
    console.log(`Reminder scheduled for user`, userId);
    
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
};

// Gracefully handle shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  process.exit(0);
});
