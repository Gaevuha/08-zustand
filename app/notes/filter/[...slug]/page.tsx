//app/notes/filter/[...slug]/page.tsx
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug?: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // const { slug } = params;
  const tag = params.slug?.[0] || 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const data = await fetchNotes('', 1, 12, tagParam);

  return {
    title: `${tag}`,
    description: `Viewing notes filtered by "${tag}". Found ${data.notes.length} notes.`,
    openGraph: {
      title: `${tag}`,
      description: `Viewing notes filtered by "${tag}". Found ${data.notes.length} notes.`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `Notes filtered by ${tag}`,
        },
      ],
      type: 'website',
    },
  };
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const data = await fetchNotes('', 1, 12, tagParam);

  if (tagParam && data.notes.length === 0) {
    notFound();
  }

  return <NotesClient initialData={data} initialTag={tag} />;
}
