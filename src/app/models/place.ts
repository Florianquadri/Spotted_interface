import { Note } from 'src/app/models/note';
export type Place = {
    _id: string;
    name: string;
    creator:string;
    canton:string;
    coordinates: [number];
    tags : [string]
    location: [number];
   
    notes?: Note[];
    averageNote?: number;
  };
