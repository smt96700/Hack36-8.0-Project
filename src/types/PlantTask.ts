import { Document, ObjectId } from 'mongoose';


export interface PlantTask {
    _id?: string ;
    plantId: string;
    taskname: string;
   
    taskDescription: string;
    createdBy: string;
    dueDate: Date;
    taskTime: string;
    dateAdded: Date;
    complete:boolean
  }
  




