import { Note } from 'src/app/models/note';
export type Place = {
    _id: string;
    name: string;
    creator:string;
    canton:string;
    location: [number];
    tags : [string]
    location: [number];
   
    notes?: Note[];
    averageNote?: number;
  };
