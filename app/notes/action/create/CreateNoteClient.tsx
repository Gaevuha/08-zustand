// app/notes/action/create/CreateNoteClient.tsx
'use client';

import dynamic from 'next/dynamic';
import css from './CreateNote.module.css';

const NoteForm = dynamic(() => import('@/components/NoteForm/NoteForm'), {
  ssr: false,
});

export default function CreateNoteClient() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
