// app/notes/[id]/page.tsx
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from '@/app/notes/[id]/NoteDetails.client';

type NoteDetailsPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: NoteDetailsPageProps) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return {
    title: `${note.title}`,
    description: `${note.content.slice(0, 100)}`,
    openGraph: {
      title: `${note.title}`,
      description: `${note.content.slice(0, 100)}`,
      url: `https://yourdomain.com/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${note.title}`,
        },
      ],
      type: 'website',
    },
  };
}

const NoteDetailsPage = async ({ params }: NoteDetailsPageProps) => {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
};
export default NoteDetailsPage;
