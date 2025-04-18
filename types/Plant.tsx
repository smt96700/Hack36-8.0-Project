export interface Plant {
    _id?: string;
    name: string;
    dateAdded?: string;
    age: number;
    position: '' | 'Indoor' | 'Terrace' | 'Balcony' | 'Garden';
    handover: boolean;
    nominee?: string;
    isCommunity:boolean;
    createdBy: string;

}