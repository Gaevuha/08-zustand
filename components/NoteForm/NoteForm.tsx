'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import css from './NoteForm.module.css';
import { useNoteStore, initialDraft } from '@/lib/store/noteStore';
import { createNote, FetchNotesResponse } from '@/lib/api';
import type { NewNoteData } from '@/types/note';
import type { ISchema } from 'yup';

interface Props {
  categories?: string[];
}

const schema = yup.object({
  title: yup
    .string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters'),
  content: yup
    .string()
    .required('Content is required')
    .max(500, 'Content is too long'),
  tag: yup.string().required('Tag is required'),
});

export default function NoteForm({ categories }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore(state => state.draft);
  const setDraft = useNoteStore(state => state.setDraft);
  const clearDraft = useNoteStore(state => state.clearDraft);

  const [formData, setFormData] = useState<NewNoteData>(draft || initialDraft);
  const [errors, setErrors] = useState<
    Partial<Record<keyof NewNoteData, string>>
  >({});

  const mutation = useMutation({
    mutationFn: (data: NewNoteData) => createNote(data),
    onSuccess: newNote => {
      queryClient.setQueryData<FetchNotesResponse>(['notes'], oldData => {
        if (!oldData) return { notes: [newNote], totalPages: 1 };
        return { ...oldData, notes: [newNote, ...oldData.notes] };
      });

      clearDraft();
      iziToast.success({
        title: 'Success',
        message: 'Note created successfully!',
        position: 'topRight',
      });
      router.back();
    },
    onError: (err: unknown) => {
      if (err instanceof Error) {
        iziToast.error({
          title: 'Error',
          message: err.message,
          position: 'topRight',
        });
      }
    },
  });

  useEffect(() => {
    setFormData(draft || initialDraft);
  }, [draft]);

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    setDraft(updated);

    try {
      const fieldSchema = yup.reach(schema, name) as ISchema<unknown>;
      await fieldSchema.validate(value);
      setErrors(prev => ({ ...prev, [name]: '' }));
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        setErrors(prev => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const values = Object.fromEntries(
      formData.entries(),
    ) as unknown as NewNoteData;

    try {
      await schema.validate(values, { abortEarly: false });
      mutation.mutate(values);
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: Partial<Record<keyof NewNoteData, string>> = {};
        err.inner.forEach(e => {
          if (e.path) fieldErrors[e.path as keyof NewNoteData] = e.message;
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          placeholder="Enter title"
          defaultValue={formData.title}
          onChange={handleChange}
          disabled={mutation.isPending}
        />
        {errors.title && <p className={css.error}>{errors.title}</p>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          placeholder="Enter content"
          defaultValue={formData.content}
          onChange={handleChange}
          disabled={mutation.isPending}
        />
        {errors.content && <p className={css.error}>{errors.content}</p>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={formData.tag}
          onChange={handleChange}
          disabled={mutation.isPending}
        >
          {(categories?.length
            ? categories
            : ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']
          ).map(tag => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {errors.tag && <p className={css.error}>{errors.tag}</p>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={css.cancelButton}
          disabled={mutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
