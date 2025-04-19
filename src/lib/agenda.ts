
import { Agenda, Job } from 'agenda';
import { sendEmailReminder } from './email';

interface ReminderJobData {
    userId: string;
    plantName: string;
    plantId: string;
};

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL || 'mongodb://localhost:27017/your-db-name',
    collection: 'agendaJobs'
  }
});


agenda.define('send watering reminder', async (job: Job<ReminderJobData>) => {
  const { userId, plantName, plantId} = job.attrs.data;
  console.log(`Sending reminder to user:`);

  try {

    await sendEmailReminder(userId, plantName, plantId);
    
  } catch (error) {
    console
  }
  
});


await agenda.start();


export const scheduleReminder = async (nextWateringTime: Date, userId: string, plantName:string, plantId: string) => {
  try {
    await agenda.schedule(nextWateringTime, 'send watering reminder', {
      userId,
      plantName,
      plantId,
    });
    console.log(`Reminder scheduled for user`, plantName);
    
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
};

// Gracefully handle shutdown
process.on('SIGTERM', async () => {
  await agenda.stop();
  process.exit(0);
});
