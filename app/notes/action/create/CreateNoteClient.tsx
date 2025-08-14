'use client';

import css from './CreateNote.module.css';
import dynamic from 'next/dynamic';

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
