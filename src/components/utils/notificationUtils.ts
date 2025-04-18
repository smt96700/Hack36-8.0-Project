
import { Plant, PlantTask, NotificationHistoryItem } from '@/types/plant';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const sendNotification = (
  title: string,
  body: string,
  icon: string = '/icons/plant.png'
): Notification | null => {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    console.warn("Notifications not available or permission not granted");
    return null;
  }

  try {
    return new Notification(title, {
      body,
      icon,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return null;
  }
};

export const checkDueTasks = (
  plants: Plant[]
): { plant: Plant; task: PlantTask }[] => {
  const now = new Date();
  const dueTasks: { plant: Plant; task: PlantTask }[] = [];

  plants.forEach((plant) => {
    plant.tasks.forEach((task) => {
      if (!task.enabled || !task.nextDue) return;

      const dueDate = new Date(task.nextDue);
      const [hours, minutes] = task.preferredTime.split(':').map(Number);
      
      // If the task is due today and the preferred time has passed
      if (
        dueDate.getDate() === now.getDate() &&
        dueDate.getMonth() === now.getMonth() &&
        dueDate.getFullYear() === now.getFullYear() &&
        (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes))
      ) {
        dueTasks.push({ plant, task });
      }
    });
  });

  return dueTasks;
};

export const calculateNextDueDate = (
  task: PlantTask,
  completedDate: Date = new Date()
): string => {
  const nextDue = new Date(completedDate);
  
  switch (task.frequency) {
    case 'daily':
      nextDue.setDate(nextDue.getDate() + 1);
      break;
    case 'weekly':
      nextDue.setDate(nextDue.getDate() + 7);
      break;
    case 'custom':
      nextDue.setDate(nextDue.getDate() + (task.customDays || 1));
      break;
  }
  
  // Reset the time to the preferred time
  const [hours, minutes] = task.preferredTime.split(':').map(Number);
  nextDue.setHours(hours, minutes, 0, 0);
  
  return nextDue.toISOString();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date().setHours(hours, minutes));
};

export const getTaskIcon = (taskType: PlantTask['type']): string => {
  switch (taskType) {
    case 'water':
      return '💧';
    case 'fertilize':
      return '🌱';
    case 'prune':
      return '✂️';
    case 'mist':
      return '💦';
    case 'rotate':
      return '🔄';
    case 'repot':
      return '🪴';
    case 'custom':
    default:
      return '📝';
  }
};
