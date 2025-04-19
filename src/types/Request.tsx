export interface Request {
    _id: string;
    from: {
        name: string;
        email: string;
    };
    to: {
        name: string;
        email: string;
    };
    plantId: {
        name: string;
        position: string;
    };
    dateAdded: Date;
    accept: boolean;
}