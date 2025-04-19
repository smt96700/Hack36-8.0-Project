export interface Community {
    _id? : string;
    communityName: string;
    plantId: string;
    description: string;
    createdBy: string;
    location : object;
    members : any;
}