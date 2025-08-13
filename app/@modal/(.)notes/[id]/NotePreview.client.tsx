'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchNoteById } from '@/lib/api';
import Loading from '@/app/loading';

type Props = {
  id: string;
};

export default function NotePreviewClient({ id }: Props) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const handleClose = () => router.back();

  return (
    <Modal onClose={handleClose}>
      {isLoading && <Loading />}
      {isError && <p>Error: {(error as Error).message}</p>}
      {data && (
        <div>
          <h2>{data.title}</h2>
          <p>
            <strong>Tag:</strong> {data.tag}
          </p>
          <p>{data.content}</p>
          <small>Created: {new Date(data.createdAt).toLocaleString()}</small>
        </div>
      )}
    </Modal>
  );
}
