import axios from 'axios';
import type { Note, NewNoteData } from '@/types/note';

axios.defaults.baseURL = 'https://notehub-public.goit.study/api';

const ACCESS_TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
if (!ACCESS_TOKEN) {
  throw new Error('NoteHub API key is missing');
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  query: string = '',
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<FetchNotesResponse> => {
  const params: Record<string, string | number> = { page, perPage };

  if (query.trim()) {
    params.search = query;
  }

  if (tag && tag.toLowerCase() !== 'all') {
    params.tag = tag;
  }

  try {
    const result = await axios.get<FetchNotesResponse>('/notes', {
      params,
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    return result.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.code === 'ENOTFOUND' || error.message === 'Network Error')
    ) {
      throw new Error('Network Error');
    }
    throw error;
  }
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  try {
    const response = await axios.get<Note>(`/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.code === 'ENOTFOUND' || error.message === 'Network Error')
    ) {
      throw new Error('Network Error');
    }
    throw error;
  }
};

export const createNote = async (noteData: NewNoteData): Promise<Note> => {
  try {
    const result = await axios.post<Note>('/notes', noteData, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return result.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.code === 'ENOTFOUND' || error.message === 'Network Error')
    ) {
      throw new Error('Network Error');
    }
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  try {
    const result = await axios.delete<Note>(`/notes/${noteId}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });
    return result.data;
  } catch (error: unknown) {
    if (
      axios.isAxiosError(error) &&
      (error.code === 'ENOTFOUND' || error.message === 'Network Error')
    ) {
      throw new Error('Network Error');
    }
    throw error;
  }
};

export const fetchTags = async (): Promise<string[]> => {
  try {
    const result = await axios.get<FetchNotesResponse>('/notes', {
      params: {
        page: 1,
        perPage: 12,
      },
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    const allTags = result.data.notes
      .map(note => note.tag)
      .filter((tag): tag is string => Boolean(tag));

    return Array.from(new Set(allTags));
  } catch (error) {
    console.error('fetchTags error:', error);
    return [];
  }
};
