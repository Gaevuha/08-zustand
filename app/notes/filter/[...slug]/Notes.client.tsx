'use client';

import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Loading from '@/app/loading';
import { fetchNotes } from '@/lib/api';
import SearchBox from '@/components/SearchBox/SearchBox';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import css from './NotesPage.module.css';
import type { FetchNotesResponse } from '@/lib/api';
import Link from 'next/link';
interface NotesClientProps {
  initialData: FetchNotesResponse;
  initialTag?: string;
}

export default function NotesClient({
  initialData,
  initialTag,
}: NotesClientProps) {
  const tag = initialTag ?? 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [debouncedSearchQuery] = useDebounce(inputValue, 300);

  const { data, isLoading, isError, error } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', tagParam ?? 'All', debouncedSearchQuery, page],
    queryFn: () => fetchNotes(debouncedSearchQuery, page, 12, tagParam),
    initialData,
    refetchOnMount: false,
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <Loading />;
  if (isError) return <p>Error: {(error as Error).message}</p>;

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={inputValue}
          onSearch={value => {
            setInputValue(value);
            setPage(1);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {data && data.notes.length === 0 && <p>No notes found.</p>}
    </div>
  );
}
