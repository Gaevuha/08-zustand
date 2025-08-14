// app/notes/filter/[...slug]/page.tsx
import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { FetchNotesResponse } from '@/lib/api';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug?.[0] || 'All';
  const tagParam = tag === 'All' ? undefined : tag;

  const data: FetchNotesResponse = {
    notes: [],
    totalPages: 0,
  };

  try {
    const fetched = await fetchNotes('', 1, 12, tagParam);
    data.notes = fetched.notes || [];
    data.totalPages = fetched.totalPages || 0;
  } catch {}

  return {
    title: `${tag}`,
    description: `Viewing notes filtered by "${tag}". Found ${data.notes.length} notes.`,
    openGraph: {
      title: `${tag}`,
      description: `Viewing notes filtered by "${tag}". Found ${data.notes.length} notes.`,
      url: `https://notehub.com/notes/filter/${encodeURIComponent(tag)}`,
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

  const data: FetchNotesResponse = {
    notes: [],
    totalPages: 0,
  };

  try {
    const fetched = await fetchNotes('', 1, 12, tagParam);
    data.notes = fetched.notes || [];
    data.totalPages = fetched.totalPages || 0;
  } catch {
    notFound();
  }

  if (!data.notes || data.notes.length === 0) {
    notFound();
  }

  return <NotesClient initialData={data} initialTag={tag} />;
}
