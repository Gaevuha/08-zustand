// app/notes/action/create/page.tsx
import CreateNoteClient from './CreateNoteClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create note',
  description: 'Fill out the form to create a note',
  openGraph: {
    title: 'Create note',
    description: 'Fill out the form to create a note',
    url: 'https://notehub.com/notes/action/create',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        alt: 'Create note',
      },
    ],
  },
};

export default function CreateNotePage() {
  return <CreateNoteClient />;
}
