// types/note.ts
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: string;
}

export interface NewNoteData {
  title: string;
  content: string;
  tag: string;
}
