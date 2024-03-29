import { Note } from 'src/app/models/note';
export type Place = {
    _id: string;
    name: string;
    creator:string;
    canton:string;
    location: [number];
    tags : [string]
    notes?: Note[];
    averageNote?: number;
    numberReviews?:number;
    distanceWithMe?:number;
    commentaire?: any;
  };
