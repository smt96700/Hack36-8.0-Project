
import { Plant, PlantTask, NotificationPreferences, NotificationHistoryItem } from '@/types/plant';
import { v4 as uuidv4 } from 'uuid';

const PLANTS_KEY = 'bloom-buddy-plants';
const NOTIFICATION_PREFS_KEY = 'bloom-buddy-notification-prefs';
const NOTIFICATION_HISTORY_KEY = 'bloom-buddy-notification-history';

// Default notification preferences
const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  enabled: true,
  defaultTime: '09:00',
  showCompletedTasks: true,
  soundEnabled: true,
};

// Helper functions for local storage
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const saveToLocalStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Plant functions
export const getPlants = (): Plant[] => {
  return getFromLocalStorage<Plant[]>(PLANTS_KEY, []);
};

export const savePlants = (plants: Plant[]): void => {
  saveToLocalStorage(PLANTS_KEY, plants);
};

export const getPlant = (id: string): Plant | undefined => {
  const plants = getPlants();
  return plants.find(plant => plant.id === id);
};

export const addPlant = (plant: Omit<Plant, 'id' | 'tasks'>): Plant => {
  const plants = getPlants();
  const newPlant: Plant = {
    ...plant,
    id: uuidv4(),
    tasks: [],
  };
  
  plants.push(newPlant);
  savePlants(plants);
  return newPlant;
};

export const updatePlant = (updatedPlant: Plant): void => {
  const plants = getPlants();
  const index = plants.findIndex(plant => plant.id === updatedPlant.id);
  
  if (index !== -1) {
    plants[index] = updatedPlant;
    savePlants(plants);
  }
};

export const deletePlant = (id: string): void => {
  const plants = getPlants();
  savePlants(plants.filter(plant => plant.id !== id));
};

// Task functions
export const addTask = (plantId: string, task: Omit<PlantTask, 'id' | 'plantId'>): PlantTask | null => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === plantId);
  
  if (plantIndex === -1) return null;
  
  const newTask: PlantTask = {
    ...task,
    id: uuidv4(),
    plantId,
  };
  
  // Calculate next due date if not provided
  if (!newTask.nextDue) {
    const now = new Date();
    const [hours, minutes] = newTask.preferredTime.split(':').map(Number);
    now.setHours(hours, minutes, 0, 0);
    
    // If time is in the past, set to tomorrow
    if (now < new Date()) {
      newTask.nextDue = now.toISOString();
    } else {
      switch (newTask.frequency) {
        case 'daily':
          now.setDate(now.getDate() + 1);
          break;
        case 'weekly':
          now.setDate(now.getDate() + 7);
          break;
        case 'custom':
          now.setDate(now.getDate() + (newTask.customDays || 1));
          break;
      }
      newTask.nextDue = now.toISOString();
    }
  }
  
  plants[plantIndex].tasks.push(newTask);
  savePlants(plants);
  return newTask;
};

export const updateTask = (updatedTask: PlantTask): boolean => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === updatedTask.plantId);
  
  if (plantIndex === -1) return false;
  
  const taskIndex = plants[plantIndex].tasks.findIndex(task => task.id === updatedTask.id);
  if (taskIndex === -1) return false;
  
  plants[plantIndex].tasks[taskIndex] = updatedTask;
  savePlants(plants);
  return true;
};

export const deleteTask = (plantId: string, taskId: string): boolean => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === plantId);
  
  if (plantIndex === -1) return false;
  
  plants[plantIndex].tasks = plants[plantIndex].tasks.filter(task => task.id !== taskId);
  savePlants(plants);
  return true;
};

export const completeTask = (plantId: string, taskId: string): PlantTask | null => {
  const plants = getPlants();
  const plantIndex = plants.findIndex(plant => plant.id === plantId);
  
  if (plantIndex === -1) return null;
  
  const taskIndex = plants[plantIndex].tasks.findIndex(task => task.id === taskId);
  if (taskIndex === -1) return null;
  
  const task = { ...plants[plantIndex].tasks[taskIndex] };
  const now = new Date();
  
  // Update last completed timestamp
  task.lastCompleted = now.toISOString();
  
  // Calculate next due date
  task.nextDue = calculateNextDueDate(task, now);
  
  // Update the task
  plants[plantIndex].tasks[taskIndex] = task;
  savePlants(plants);
  
  // Add to notification history
  addNotificationHistory({
    id: uuidv4(),
    taskId: task.id,
    plantId: plantId,
    taskType: task.type,
    taskName: task.name,
    plantName: plants[plantIndex].name,
    timestamp: now.toISOString(),
    status: 'completed',
  });
  
  return task;
};

// Calculate next due date for a task
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
  
  // Set time to preferred time
  const [hours, minutes] = task.preferredTime.split(':').map(Number);
  nextDue.setHours(hours, minutes, 0, 0);
  
  return nextDue.toISOString();
};

// Notification preferences
export const getNotificationPreferences = (): NotificationPreferences => {
  return getFromLocalStorage<NotificationPreferences>(
    NOTIFICATION_PREFS_KEY,
    DEFAULT_NOTIFICATION_PREFS
  );
};

export const updateNotificationPreferences = (prefs: Partial<NotificationPreferences>): NotificationPreferences => {
  const currentPrefs = getNotificationPreferences();
  const updatedPrefs = { ...currentPrefs, ...prefs };
  saveToLocalStorage(NOTIFICATION_PREFS_KEY, updatedPrefs);
  return updatedPrefs;
};

// Notification history
export const getNotificationHistory = (): NotificationHistoryItem[] => {
  return getFromLocalStorage<NotificationHistoryItem[]>(NOTIFICATION_HISTORY_KEY, []);
};

export const addNotificationHistory = (item: NotificationHistoryItem): void => {
  const history = getNotificationHistory();
  history.unshift(item); // Add to the beginning
  
  // Limit history to 100 items
  if (history.length > 100) {
    history.pop();
  }
  
  saveToLocalStorage(NOTIFICATION_HISTORY_KEY, history);
};

export const clearNotificationHistory = (): void => {
  saveToLocalStorage(NOTIFICATION_HISTORY_KEY, []);
};
